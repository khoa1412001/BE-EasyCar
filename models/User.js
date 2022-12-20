var mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  role = require("../configs/RoleList");
const mongoose_delete = require("mongoose-delete");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
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
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    driverLicenseNumber: {
      type: String,
      default: "",
    },
    fullname: {
      type: String,
      default: "",
    }, //in license
    driverLicenseImg: {
      type: String,
      default: "",
    },
    bod: {
      type: Date,
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/dmdtcm833/image/upload/v1669454227/avatar/default.jpg",
    },
    socialId: {
      type: String,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    balance: {
      type: Number,
      default: 0,
    },
    role: {
      type: Number,
      default: role.CUSTOMER,
    },
    gender: {
      type: String,
      default: "MALE",
    },
    isgoogleaccount: {
      type: Boolean,
      default: false,
    },
    bank: {
      type: String,
      default: "",
    },
    banknumber: {
      type: Number,
      default: 0,
    },
    bankaccountname: {
      type: String,
      default: "",
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
UserSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
  indexFields: ["deleted", "deletedAt"],
});
module.exports = mongoose.model("User", UserSchema);
