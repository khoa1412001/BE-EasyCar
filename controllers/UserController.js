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
}
function Login(req, res) {
  console.log(req.body);
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
    const token = jwtService.generateToken(user._id, user.role);
    return res.status(200).json({ token: token });
  });
}
function getUserData(req, res) {
  User.findById(req.user.userId, (err, user) => {
    if (err) return res.status(401).send("User not found");
    res.status(200).json(user);
  });
}
module.exports = { Login, Register, getUserData };
