// services/emailService.js

const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shreyansh.socialseller@gmail.com",
    pass: "hjdn hska uklf myay",
  },
});

const sendOrderConfirmationEmail = (toEmail, htmlContent) => {
  const details = {
    from: "shreyansh.socialseller@gmail.com",
    to: toEmail,
    subject: "Order Confirmation",
    html: htmlContent,
  };

  return mailTransporter.sendMail(details);
};

module.exports = {
  sendOrderConfirmationEmail,
};
