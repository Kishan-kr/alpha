const { default: axios } = require("axios");

const apiKey = process.env.TWO_FACTOR_API_KEY;
const otpTemplateName = process.env.TWO_FACTOR_OTP_TEMPLATE;

function encode(param) {
  return encodeURIComponent(param);
}

async function sendOTPSms(phoneNumber, otpValue) {
  if (phoneNumber.length == 10) {
    phoneNumber = `+91${phoneNumber}`;
  }
  
  const url = `https://2factor.in/API/V1/${encode(apiKey)}/SMS/${encode(phoneNumber)}/${encode(otpValue)}/${encode(otpTemplateName)}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Failed to send OTP:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Send order confirmation SMS to user
 * @param {string} phone - User's phone number
 * @param {string} orderNumber - Order number
 * @param {number|string} orderTotal - Order grand total
 */
async function sendOrderConfirmationSMS(phone, orderNumber, orderTotal) {
  try {
    if (phone.length == 10) {
      phone = `+91${phone}`;
    }
    // Compose message
    const message = `Thank you for your order! Order No: ${orderNumber}. Total: ₹${orderTotal}. Team Tashn.`;
    // 2Factor API for custom SMS
    const url = `https://2factor.in/API/V1/${encode(apiKey)}/SMS/${encode(phone)}/${encode(message)}`;
    const response = await axios.get(url);
    console.log(`Order confirmation SMS sent to ${phone} for order ${orderNumber}`);
    return response.data;
  } catch (err) {
    console.error("Error sending order confirmation SMS:", err.message);
  }
}

module.exports = { sendOTPSms, sendOrderConfirmationSMS }