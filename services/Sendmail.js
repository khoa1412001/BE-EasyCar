const nodemailer = require("nodemailer");
require("dotenv").config;
async function Sendmail(email, subject, text) {
  var transporter = nodemailer.createTransport({
    // config mail server
    port: 465,
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    secure: true
  });
  
  await new Promise((resolve, reject) => {
    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
            reject(error);
        } else {
            console.log("Server is ready to take our messages");
            resolve(success);
        }
    });
});

  var mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: subject,
    text: text,
  };

  await new Promise((resolve, reject) => {
    // send mail
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            reject(err);
        } else {
            resolve(info);
        }
    });
});

 return true
}

module.exports = Sendmail;
