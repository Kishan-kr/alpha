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

module.exports = { sendOTPSms }