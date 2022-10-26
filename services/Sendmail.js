const nodemailer = require("nodemailer");
require("dotenv").config;
function Sendmail(email) {
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
    subject: "Test mail",
    text: "Test mail",
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return false;
    }
    return true;
  });
}

module.exports = Sendmail;
