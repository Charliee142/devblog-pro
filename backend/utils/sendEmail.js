const nodemailer = require('nodemailer');

/**
 * Send Email Utility
 *
 * TEACHING NOTE:
 * This utility abstracts the email-sending logic.
 * We use nodemailer with Gmail SMTP.
 * For production, consider SendGrid or AWS SES.
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"DevBlog Pro" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
