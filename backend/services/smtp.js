const nodemailer = require('nodemailer');
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

module.exports = { sendOtpEmail };