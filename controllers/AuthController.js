const { json } = require("express");
var mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  dotenv = require("dotenv"),
  sendMail = require("../services/Sendmail"),
  User = require("../models/User"),
  jwtService = require("../services/JWTService"),
  { OAuth2Client } = require("google-auth-library");
dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

function Register(req, res) {
  var newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser
    .save()
    .then(() => {
      return res.status(201).json({
        message: "Tạo tài khoản thành công",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Lỗi máy chủ, vui lòng thử lại sau.",
      });
    });
}
function Login(req, res) {
  User.findOne({ email: req.body.username }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: "Lỗi máy chủ, vui lòng thử lại sau.",
      });
    }
    if (user === null || !bcrypt.compareSync(req.body.password, user.password))
      return res.status(400).json({
        message: "Sai tài khoản hoặc mật khẩu, vui lòng kiểm tra lại!",
      });
    const accessToken = jwtService.generateToken(user._id, user.role);
    return res.status(200).json({ accesstoken: accessToken });
  });
}
function getUserData(req, res) {
  User.findById(req.user.userId, (err, user) => {
    if (err)
      return res.status(401).json({ message: "Không tìm thấy người dùng" });
    res.status(200).json({
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
      location: user.location,
      gender: user.gender,
    });
  });
}
function checkEmail(req, res) {
  User.countDocuments({ email: req.body.email }, (err, count) => {
    if (count > 0) {
      return res.status(400).json({ message: "Tài khoản đã tồn tại" });
    }
    return res.status(200).json({ message: "Tài khoản hợp lệ" });
  });
}
async function changePassword(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (
      user === null ||
      !bcrypt.compareSync(req.body.oldPassword, user.password)
    )
      return res
        .status(400)
        .json({ message: "Mật khẩu cũ không hợp lệ, vui lòng thử lại" });
    user.password = bcrypt.hashSync(req.body.newPassword, 10);
    await user.save();
    return res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau!" });
  }
}
async function sendValidateMail(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (sendMail(user.email))
      return res.status(200).json({ message: "Gửi mail xác thực thành công" });
    return res.status(400).json({
      message: "Hệ thống tạm thời không gửi được email, vui lòng thử lại sau",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
  }
}
function refreshToken(req, res) {}

async function loginWithGoogle(req, res) {
  console.log(req.body);
  const { token } = req.body;

  const ticket = await client.getTokenInfo(token);
  console.log(ticket);
  const { name, email, picture } = ticket.getPayload();
  // const user = await db.user.upsert({
  //   where: { email: email },
  //   update: { name, picture },
  //   create: { name, email, picture },
  // });
  console.log(`${name}:${email}:${picture}`);
  // console.log(ticket);
  res.status(201).json({ message: "Susge" });
}
module.exports = {
  Login,
  Register,
  getUserData,
  checkEmail,
  changePassword,
  sendValidateMail,
  refreshToken,
  loginWithGoogle,
};
