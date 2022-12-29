const { json } = require("express");
var mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  dotenv = require("dotenv"),
  sendMail = require("../services/Sendmail"),
  User = require("../models/User"),
  jwtService = require("../services/JWTService"),
  { OAuth2Client } = require("google-auth-library"),
  roleList = require("../configs/RoleList"),
  axios = require("axios");
dotenv.config();
const CLIENT_URL = process.env.CLIENT_URL;
const googleClient = new OAuth2Client({
  clientId: `${process.env.GOOGLE_OAUTH_CLIENT_ID}`,
});

const AuthController = {
  LoginAdmin: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.username });
      if (!user || !user.password || !bcrypt.compareSync(req.body.password, user.password))
        return ErrorMsgPayload(res, "Sai tài khoản hoặc mật khẩu, vui lòng kiểm tra lại!");
      if (!user.status) return ErrorMsgPayload(res, "Tài khoản này chưa được xác thực");
      if (user.role === roleList.CUSTOMER)
        return ErrorMsgPayload(res, "Đây không phải tài khoản admin");
      const accessToken = jwtService.generateToken(user._id, user.role);
      return res.status(200).json({ accesstoken: accessToken });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        message: "Lỗi máy chủ, vui lòng thử lại sau.",
      });
    }
  },
  Register: async (req, res) => {
    var newUser = new User(req.body);
    try {
      newUser.password = bcrypt.hashSync(req.body.password, 10);
      // await newUser.save();
      const subject = "Kích hoạt tài khoản";
      const token = jwtService.generateMailToken(newUser.email);
      var context =
        "Bấm vào đường link bên dưới để xác thực tài khoản\n" +
        `${CLIENT_URL}/validate?token=${token}`;
      await sendMail(newUser.email, subject, context).then(result => console.log("Success")).catch(error => console.log(error))
      return res.status(201).json({
        message: "Tạo tài khoản thành công, kiểm tra mail để xác thực tài khoản",
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({
        message: "Lỗi máy chủ, vui lòng thử lại sau.",
      });
    }
  },
  Login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.username });
      if (!user || !user.password || !bcrypt.compareSync(req.body.password, user.password))
        return res.status(400).json({
          message: "Sai tài khoản hoặc mật khẩu, vui lòng kiểm tra lại!",
        });
      if (!user.status)
        return res.status(400).json({ message: "Tài khoản này chưa được xác thực" });
      const accessToken = jwtService.generateToken(user._id, user.role);
      return res.status(200).json({ accesstoken: accessToken });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        message: "Lỗi máy chủ, vui lòng thử lại sau.",
      });
    }
  },
  CheckEmail: (req, res) => {
    User.countDocuments({ email: req.body.email }, (err, count) => {
      if (count > 0) {
        return res.status(400).json({ message: "Tài khoản đã tồn tại" });
      }
      return res.status(200).json({ message: "Tài khoản hợp lệ" });
    });
  },
  ChangePassword: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (user === null || !bcrypt.compareSync(req.body.oldPassword, user.password))
        return res.status(400).json({ message: "Mật khẩu cũ không hợp lệ, vui lòng thử lại" });
      user.password = bcrypt.hashSync(req.body.newPassword, 10);
      await user.save();
      return res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau!" });
    }
  },
  SendValidateMail: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      if (sendMail(user.email))
        return res.status(200).json({ message: "Gửi mail xác thực thành công" });
      return res.status(400).json({
        message: "Hệ thống tạm thời không gửi được email, vui lòng thử lại sau",
      });
    } catch (error) {
      return res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
    }
  },
  RefreshToken: (req, res) => {},

  LoginWithGoogle: async (req, res) => {
    const { token } = req.body;
    const ticket = await googleClient.getTokenInfo(token);
    const userCount = await User.countDocuments({ email: ticket.email });
    if (userCount !== 0) return res.status(200).json({ message: "Đăng nhập thành công" });

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
      return res.status(400).json({ message: "Đã xảy ra lỗi vui lòng thử lại sau" });
    }
  },
  ValidateMail: async (req, res) => {
    try {
      const token = req.params.token;
      const data = jwt.verify(token, process.env.MAIL_VALIDATE_KEY);
      const user = await User.findOne({ email: data.email });
      user.status = true;
      await user.save();
      return res.status(200).json({ message: "Xác thực thành công" });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Xác thực thất bại" });
    }
  },
};
module.exports = AuthController;
