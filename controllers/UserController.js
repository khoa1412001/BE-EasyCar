const User = require("../models/User");
const UserVerificationRequest = require("../models/UserVerificationRequest");
const { uploadSingle, uploadArray } = require("../utils/Cloudinary");
const statusList = require("../configs/StatusList");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");

const {
  ErrorPayload,
  ErrorMsgPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
} = require("../payloads");
const UserController = {
  UpdateUserInfo: async (req, res) => {
    const { location, username, phoneNumber, gender, longitude, latitude } = req.body;
    try {
      const user = await User.findById(req.user.userId);
      if (location) user.location = location;
      if (username) user.username = username;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (gender) user.gender = gender;
      if (longitude) user.longitude = longitude;
      if (latitude) user.latitude = latitude;
      await user.save();
      return res.status(200).json({ message: "Cập nhật thông tin thành công" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Cập nhật thông tin thất bại, vui lòng thử lại sau" });
    }
  },

  UpdateAvatar: async (req, res) => {
    try {
      //xu ly xoa hinh anh cu~
      const user = await User.findById(req.user.userId);
      const result = await uploadSingle(req.file);
      user.avatar = result.secure_url;
      await user.save();
      return res.status(200).json({ message: "Cập nhật ảnh đại diện thành công" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
    }
  },
  VerifyUser: async (req, res) => {
    try {
      const countRequest = await UserVerificationRequest.countDocuments({
        userId: req.user.userId,
      });
      if (countRequest)
        return res.status(400).json({
          message: "Bạn đã gửi yêu cầu xác thực tài khoản, xin vui lòng đợi!",
        });

      const result = await uploadSingle(req.file);

      var newRequest = new UserVerificationRequest();
      newRequest.userId = req.user.userId;
      newRequest.username = req.body.username;
      newRequest.driverLicenseNumber = req.body.driverlicense;
      newRequest.bod = req.body.bod;
      newRequest.driverLicenseImg = result.secure_url;
      await newRequest.save();
      res.status(200).json({
        message: "Tạo yêu cầu xác thực tài khoản thành công",
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Lỗi hệ thống xin vui lòng thử lại sau" });
    }
  },

  UpdateBankInfo: async (req, res) => {
    try {
      const user = await User.findById(req.user.userId);
      user.bank = req.body.bank;
      user.bankaccountname = req.body.bankaccountname;
      user.banknumber = Number(req.body.banknumber);
      await user.save();
      return res.status(200).json({ message: "Cập nhật thông tin tài khoản thành công" });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Lỗi hệ thống vui lòng thử lại sau" });
    }
  },

  GetUserData: async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(
        userId,
        "username email avatar phoneNumber location gender balance verification bank bankaccountname banknumber latitude longitude"
      ).lean();
      return res.status(200).json({ data: user });
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
};
module.exports = UserController;
