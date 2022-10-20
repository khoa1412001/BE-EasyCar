var mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  location: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  driverLicenseImg: {
    type: String,
  },
  selfieImg: {
    type: String,
  },
  socialImg: {
    type: String,
  },
  verification: {
    type: Boolean,
  },
  carowner: {
    type: Boolean,
  },
  balance: {
    type: Number,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
