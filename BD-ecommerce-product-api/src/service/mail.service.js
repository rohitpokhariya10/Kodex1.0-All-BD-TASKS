const  transporter = require("../config/mail");

const sendmail = async ({ to, subject, text, html }) => {
  if (!to) {
    throw new Error("Receiver email is required");
  }

  if (!subject) {
    throw new Error("Email subject is required");
  }

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  return info;
};

module.exports = sendmail;
