const mongoose = require("mongoose");
const statusList = require("../configs/statusList");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const UserVerificationRequestSchema = new Schema(
  {
    _id: {
      type: ObjectId,
    },
    username: {
      type: String,
      required: true,
    },
    driverLicenseNumber: {
      type: String,
      required: true,
    },
    bod: {
      type: Date,
      required: true,
    },
    driverLicenseImg: {
      type: String,
      required: true,
    },
    status: {
      type: Number,
      default: statusList.PENDING,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "UserVerificationRequest",
  UserVerificationRequestSchema
);
