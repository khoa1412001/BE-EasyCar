const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  id: {
    type: String,
    default: uuid.v1,
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
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

module.exports = mongoose.model("users", UserSchema);
