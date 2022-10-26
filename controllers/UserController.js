const { json } = require("express");
var mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  dotenv = require("dotenv");
// User = mongoose.model("User");
var User = require("../models/User"),
  jwtService = require("../services/JWTService");
dotenv.config();

function Register(req, res) {
  var newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "Tạo tài khoản thành công",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
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
    if (err) return res.status(401).send("Không tìm thấy người dùng");
    res.status(200).json({
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      phoneNumber: user.phoneNumber,
    });
  });
}
function checkEmail(req, res) {
  User.countDocuments({ email: req.body.email }, (err, count) => {
    if (count > 0) {
      return res.status(400).send("Tài khoản đã tồn tại");
    }
    return res.status(200).send("Tài khoản hợp lệ");
  });
}
module.exports = { Login, Register, getUserData, checkEmail };
