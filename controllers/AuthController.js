const { json } = require("express");
var mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  dotenv = require("dotenv"),
  sendMail = require("../services/Sendmail"),
  User = require("../models/User"),
  jwtService = require("../services/JWTService"),
  { OAuth2Client } = require("google-auth-library"),
  axios = require("axios");
dotenv.config();
const googleClient = new OAuth2Client({
  clientId: `${process.env.GOOGLE_OAUTH_CLIENT_ID}`,
});

async function Register(req, res) {
  var newUser = new User(req.body);
  try {
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser.save();
    const subject = "Kích hoạt tài khoản";
    const token = jwtService.generateMailToken(newUser.email);
    var context =
      "Bấm vào đường link bên dưới để xác thực tài khoản\n" +
      `http://localhost:5000/validate/${token}`;
    await sendMail(newUser.email, subject, context);
    return res.status(201).json({
      message: "Tạo tài khoản thành công, kiểm tra mail để xác thực tài khoản",
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      message: "Lỗi máy chủ, vui lòng thử lại sau.",
    });
  }
}
async function Login(req, res) {
  try {
    const user = await User.findOne({ email: req.body.username });
    if (
      !user ||
      !user.password ||
      !bcrypt.compareSync(req.body.password, user.password)
    )
      return res.status(400).json({
        message: "Sai tài khoản hoặc mật khẩu, vui lòng kiểm tra lại!",
      });
    if (!user.status)
      return res
        .status(400)
        .json({ message: "Tài khoản này chưa được xác thực" });
    const accessToken = jwtService.generateToken(user._id, user.role);
    return res.status(200).json({ accesstoken: accessToken });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      message: "Lỗi máy chủ, vui lòng thử lại sau.",
    });
  }
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
  const { token } = req.body;
  const ticket = await googleClient.getTokenInfo(token);
  const userCount = await User.countDocuments({ email: ticket.email });
  if (userCount !== 0)
    return res.status(200).json({ message: "Đăng nhập thành công" });

  try {
    const result = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );
    const newUser = new User();
    newUser.username = result.data.name;
    newUser.avatar = result.data.picture;
    newUser.email = result.data.email;
    newUser.status = result.data.email_verified;
    newUser.isgoogleaccount = true;
    await newUser.save();
    return res.status(200).json({ message: "Tạo tài khoản thành công" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ message: "Đã xảy ra lỗi vui lòng thử lại sau" });
  }
}

async function validateMail(req, res) {
  try {
    const token = req.params.token;
    const data = jwt.verify(token, process.env.MAIN_VALIDATE_KEY);
    const user = await User.find({ email: data.email });
    user.status = true;
    await user.save();
    return res.status(200).json({ message: "Xác thực thành công" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ message: "Link xác thực tài khoản đã hết hạn" });
  }
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
  validateMail,
};
