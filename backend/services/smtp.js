
const nodemailer = require('nodemailer');
const { ORDERS_EMAIL_ADDRESS } = require('../utils/constants');
const emailPassword = process.env.SMTP_PASSWORD;

// Configure transporter using Hostinger SMTP
const mailConfig = {
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@tashn.in',
    pass: emailPassword,
  }
};

async function sendEmail({from, subject, body, to, cc, attachments}) {
  let transporter = nodemailer.createTransport(mailConfig);

  let mailOptions = {
    from: from || '"Tashn Support" <noreply@tashn.in>',
    to,
    cc,
    subject,
    html: body,
    attachments: attachments
  };

  try {
    let mailResponse = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", mailResponse.messageId);
    return mailResponse.messageId
  } catch (error) {
    console.error("Failed to send email:", error.message);
    throw new Error('Error sending email');
  }
}

async function sendOtpEmail(to, otp) {
  const mailId = await sendEmail({
    from: '"Tashn Support" <noreply@tashn.in>',
    to,
    subject: 'Your verification code',
    body: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #000;">Hello from <span style="color: #e91e63;">Tashn</span>,</h2>
        <p>We received a request to verify your identity. Please use the code below:</p>
        <div style="font-size: 22px; font-weight: bold; margin: 20px 0; color: #e91e63;">
          ${otp}
        </div>
        <p>This code is valid for the next <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
        <hr style="margin: 30px 0;">
        <p style="font-size: 12px; color: #999;">If you did not request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #999;">Need help? Contact us at <a href="mailto:support@tashn.in">support@tashn.in</a>.</p>
      </div>
    `
  })

  return mailId;
}

/**
 * Send order confirmation email to user
 * @param {string} email - User's email address
 * @param {string} orderNumber - Order number
 * @param {object} orderDetails - Full order object (should include items, totals, etc.)
 */
async function sendOrderConfirmationEmail(email, orderNumber, orderDetails) {
  try {
    const itemsHtml = (orderDetails?.items || []).map(item => `
      <tr>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.title}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.size || "-"}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.color || "-"}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.quantity}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">₹${item.price}</td>
      </tr>
    `).join("");

    const body = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #000;">Thank you for your order!</h2>
        <p>Your order <strong>${orderNumber}</strong> has been placed successfully.</p>
        <p><strong>Payment Method:</strong> ${orderDetails?.payment?.method || "-"}</p>
        <h3 style="margin-top:30px;">Order Details:</h3>
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
          <thead>
            <tr style="background:#f8f8f8;">
              <th style="padding:8px 12px; text-align:left;">Product</th>
              <th style="padding:8px 12px; text-align:left;">Size</th>
              <th style="padding:8px 12px; text-align:left;">Color</th>
              <th style="padding:8px 12px; text-align:left;">Qty</th>
              <th style="padding:8px 12px; text-align:left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div style="margin-top:20px;">
          <p><strong>Subtotal:</strong> ₹${orderDetails?.totals?.itemsTotal || 0}</p>
          <p><strong>Shipping Fee:</strong> ₹${orderDetails?.totals?.shippingFee || 0}</p>
          <p><strong>Discount:</strong> ₹${orderDetails?.totals?.discount || 0}</p>
          <p style="font-size:18px;"><strong>Grand Total:</strong> ₹${orderDetails?.totals?.grandTotal || 0}</p>
        </div>
        <hr style="margin:30px 0;">
        <p style="font-size:12px; color:#999;">If you have any questions, contact us at <a href="mailto:support@tashn.in">support@tashn.in</a>.</p>
      </div>
    `;

    await sendEmail({
      from: 'Tashn <noreply@tashn.in>',
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      body,
    });
    console.log(`Order confirmation email sent to ${email} for order ${orderNumber}`);
  } catch (err) {
    console.error("Error sending order confirmation email:", err.message);
  }
}

/**
 * Send order confirmation email to admin
 * @param {string} orderNumber - Order number
 * @param {object} orderDetails - Full order object (should include items, totals, etc.)
 */
async function sendOrderConfirmationEmailToAdmin(orderNumber, orderDetails) {
  try {
    const itemsHtml = (orderDetails?.items || []).map(item => `
      <tr>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.title}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.size || "-"}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.color || "-"}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.quantity}</td>
        <td style="padding:8px 12px; border-bottom:1px solid #eee;">₹${item.price}</td>
      </tr>
    `).join("");

    const body = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #000;">New Order Received!</h2>
        <p>Order <strong>${orderNumber}</strong> has been placed.</p>
        <p><strong>Payment Method:</strong> ${orderDetails?.payment?.method || "-"}</p>
        <h3 style="margin-top:30px;">Order Details:</h3>
        <table style="width:100%; border-collapse:collapse; margin-top:10px;">
          <thead>
            <tr style="background:#f8f8f8;">
              <th style="padding:8px 12px; text-align:left;">Product</th>
              <th style="padding:8px 12px; text-align:left;">Size</th>
              <th style="padding:8px 12px; text-align:left;">Color</th>
              <th style="padding:8px 12px; text-align:left;">Qty</th>
              <th style="padding:8px 12px; text-align:left;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div style="margin-top:20px;">
          <p><strong>Subtotal:</strong> ₹${orderDetails?.totals?.itemsTotal || 0}</p>
          <p><strong>Shipping Fee:</strong> ₹${orderDetails?.totals?.shippingFee || 0}</p>
          <p><strong>Discount:</strong> ₹${orderDetails?.totals?.discount || 0}</p>
          <p style="font-size:18px;"><strong>Grand Total:</strong> ₹${orderDetails?.totals?.grandTotal || 0}</p>
        </div>
        <hr style="margin:30px 0;">
        <p style="font-size:12px; color:#999;">Order placed by user ID: <strong>${orderDetails?.userId}</strong></p>
      </div>
    `;

    await sendEmail({
      from: 'Tashn <noreply@tashn.in>',
      to: ORDERS_EMAIL_ADDRESS,
      subject: `New Order Received - ${orderNumber}`,
      body,
    });
    console.log(`Order confirmation email sent to admin ${ORDERS_EMAIL_ADDRESS} for order ${orderNumber}`);
  } catch (err) {
    console.error("Error sending order confirmation email to admin:", err.message);
  }
}

module.exports = { sendOtpEmail, sendOrderConfirmationEmail, sendOrderConfirmationEmailToAdmin };