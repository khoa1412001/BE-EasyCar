const nodemailer = require("nodemailer");
const {google} = require('googleapis')

require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN


async function Sendmail(email, subject, text) {
  try {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET, REDIRECT_URI)
    oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN})
    const accessToken = await oAuth2Client.getAccessToken()
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'easycar2812@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    })
    const mailOptions = {
      from: 'EasyCar <easycar2812@gmail>',
      to: email,
      subject: subject,
      text: text
    }
    const result = transport.sendMail(mailOptions)
    return result
  } catch (error) {
    console.log(error.message)
    return error
  }
}
//   var transporter = nodemailer.createTransport({
//     // config mail server
//     port: 465,
//     service: "gmail",
//     host: "smtp.gmail.com",
//     auth: {
//       user: process.env.MAIL_USERNAME,
//       pass: process.env.MAIL_PASSWORD,
//     },
//     secure: true
//   });
  
//   await new Promise((resolve, reject) => {
//     // verify connection configuration
//     transporter.verify(function (error, success) {
//         if (error) {
//             console.log(error);
//             reject(error);
//         } else {
//             console.log("Server is ready to take our messages");
//             resolve(success);
//         }
//     });
// });

//   var mailOptions = {
//     from: process.env.MAIL_USERNAME,
//     to: email,
//     subject: subject,
//     text: text,
//   };

//   await new Promise((resolve, reject) => {
//     // send mail
//     transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//             console.error(err);
//             reject(err);
//         } else {
//             resolve(info);
//         }
//     });
// });

//  return true


module.exports = Sendmail;
