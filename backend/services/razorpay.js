const Razorpay = require("razorpay");
const Order = require("../models/order");
const User = require("../models/user");
const { CURRENCY } = require("../utils/enums");
const crypto = require("crypto");
const { mapRazorpayMethod, mapRazorpayPaymentStatus } = require("../utils/maps");
const { clearUserCart } = require("../utils/cart");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = CURRENCY.INR, orderNumber, orderId } = req.order;

    const options = {
      amount: amount * 100, // convert to paise
      currency,
      receipt: orderNumber,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Atomically update Razorpay order_id in DB
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        $set: { "payment.razorpay_order_id": razorpayOrder.id }
      });
    }
    
    console.log('Order initaited at razorpay with order id', razorpayOrder.id); // debug
    res.json({ status: true, order: razorpayOrder });
  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
};

// 2. Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const { order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(order_id + "|" + razorpay_payment_id)
      .digest("hex");

    // Find the order by Razorpay order_id
    const orderDoc = await Order.findOne({ "payment.razorpay_order_id": order_id });
    if (!orderDoc) {
      return res.status(404).json({ status: false, error: "Order not found" });
    }

    // Fetch payment details from Razorpay API to get payment method
    let paymentMethod;
    let paymentStatus;
    try {
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      if (paymentDetails) {
        console.log('Fetched payment details from Razorpay: status ->', paymentDetails.status); // debug
        paymentMethod = mapRazorpayMethod(paymentDetails.method);
        paymentStatus = mapRazorpayPaymentStatus(paymentDetails.status);
      }
    } catch (err) {
      console.error("Failed to fetch payment details from Razorpay:", err.message);
    }

    if (generated_signature === razorpay_signature) {
      // Payment verified
      orderDoc.payment.status = paymentStatus || "PAID";
      orderDoc.payment.transactionId = razorpay_payment_id;
      orderDoc.payment.razorpay_order_id = order_id;
      orderDoc.payment.razorpay_signature = razorpay_signature;
      if (paymentMethod) orderDoc.payment.method = paymentMethod;
      orderDoc.status = "CONFIRMED";
      orderDoc.payment.updatedAt = new Date();
      await orderDoc.save();

      // Clear cart of the user (reusable utility)
      try {
        await clearUserCart(orderDoc.userId);
      } catch (cartErr) {
        console.error("Failed to clear user cart after payment:", cartErr.message);
      }

      // Send confirmation SMS and/or email using user info
      try {
        const user = await User.findById(orderDoc.userId).select("phone email");

        require("./smtp").sendOrderConfirmationEmailToAdmin(orderDoc.orderNumber, orderDoc);
        
        if (user?.email) {
          require("./smtp").sendOrderConfirmationEmail(user.email, orderDoc.orderNumber, orderDoc);
        }

        if (user?.phone) {
          require("./twoFactor").sendOrderConfirmationSMS(user.phone, orderDoc.orderNumber, orderDoc.totals?.grandTotal);
        }
      } catch (notifyErr) {
        console.error("Failed to send order confirmation notification:", notifyErr.message);
      }

      const token = crypto.randomBytes(64).toString("hex");
      console.log('Pyament status verified for order id', order_id); // debug
      return res.json({ status: true, token, orderNumber: orderDoc.orderNumber });
    } else {
      // Payment failed or invalid signature
      orderDoc.payment.status = paymentStatus || "FAILED";
      orderDoc.payment.transactionId = razorpay_payment_id;
      orderDoc.payment.razorpay_order_id = order_id;
      orderDoc.payment.razorpay_signature = razorpay_signature;
      if (paymentMethod) orderDoc.payment.method = paymentMethod;
      orderDoc.status = "PAYMENT_FAILED";
      orderDoc.payment.updatedAt = new Date(); 
      await orderDoc.save();
      console.error("Failed to verify payment signature for order id:", order_id); // debug
      return res.status(400).json({ status: false, error: "Invalid signature" });
    }
  } catch (err) {
    console.error("Unexpected error in verifyPayment:", err.message);
    return res.status(500).json({ status: false, error: "Server error during payment verification" });
  }
};

module.exports = { createRazorpayOrder, verifyPayment };