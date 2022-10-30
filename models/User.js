var mongoose = require("mongoose"),
  bcrypt = require("bcrypt"),
  Schema = mongoose.Schema,
  role = require("../configs/roleList");
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
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
    driverLicenseImg: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default:
        "https://scr.vn/wp-content/uploads/2020/07/Avatar-Facebook-tr%E1%BA%AFng.jpg",
    },
    socialId: {
      type: String,
      required: true,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    carowner: {
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
      default:"MALE",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
