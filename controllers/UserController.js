const { json } = require("express");
var mongoose = require("mongoose"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  dotenv = require("dotenv");
// User = mongoose.model("User");
var User = require("../models/User");
dotenv.config();

exports.register = function (req, res) {
  var newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  newUser
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: "New user created",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error. Please try again.",
      });
    });
};
exports.login = function (req, res) {
  User.findOne({ username: req.body.username }, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        message: "Server error, please try again!",
      });
    }
    if (user === null || !bcrypt.compareSync(req.body.password, user.password))
      return res.status(200).json({
        message: "Wrong username or password, please check again!",
      });
    let jwtKey = process.env.JWT_SECRET_KEY;
    let data = {
      userId: user._id,
    };
    const token = jwt.sign(data, jwtKey);
    return res.status(200).json({ token: token });
  });
};
exports.loginRequired = function (req, res) {};
