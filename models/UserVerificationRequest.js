const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;
const UserVerificationRequestSchema = new Schema({
  id: {
    type: String,
    default: uuid.v1,
  },
  name: {
    type: String,
  },
  phonenumber: {
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
});
module.exports = mongoose.model(
  "UserVerificationRequest",
  UserVerificationRequestSchema
);
