const nodemailer = require("nodemailer");
require("dotenv").config;
async function Sendmail(email, subject, text) {
  var transporter = nodemailer.createTransport({
    // config mail server
    service: "gmail",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  var mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: subject,
    text: text,
  };
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return false;
    }
    return true;
  });
}

module.exports = Sendmail;
