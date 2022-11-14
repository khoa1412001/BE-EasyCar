const User = require("../models/User");
const UserVerificationRequest = require("../models/UserVerificationRequest");
const { uploadSingle, uploadArray } = require("../utils/Cloudinary");
const statusList = require("../configs/StatusList");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");

async function UpdateUser(req, res) {
  const { location, username, phonenumber, gender } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (location) user.location = location;
    if (username) user.username = username;
    if (phonenumber) user.phoneNumber = phonenumber;
    if (gender) user.gender = gender;
    await user.save();
    return res.status(200).json({ message: "Cập nhật thông tin thành công" });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "Cập nhật thông tin thất bại, vui lòng thử lại sau" });
  }
}
async function UpdateAvatar(req, res) {
  try {
    //xu ly xoa hinh anh cu~
    const user = await User.findById(req.user.userId);
    const result = await uploadSingle(req.files);
    user.avatar = result.url;
    await user.save();
    return res
      .status(200)
      .json({ message: "Cập nhật ảnh đại diện thành công" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
}
async function VerifyUser(req, res) {
  try {
    const countRequest = await UserVerificationRequest.countDocuments({
      userId: req.user.userId,
      status: statusList.PENDING,
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
    newRequest.driverLicenseImg = result.url;
    await newRequest.save();
    res.status(200).json({
      message: "Tạo yêu cầu xác thực tài khoản thành công",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống xin vui lòng thử lại sau" });
  }
}
async function GetRentalHistory(req, res) {
  try {
    const rentalHistory = await VehicleRentalHistory.find({
      userid: req.user.userId,
    })
      .populate(
        "Vehicle",
        "brand model fueltype fuelconsumption transmission seats modelimage"
      )
      .populate("User", "location")
      .lean();
    return res.status(200).json({ data: rentalHistory });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ message: "Không thể lấy được lịch sử thuê xe" });
  }
}
module.exports = { UpdateUser, UpdateAvatar, VerifyUser, GetRentalHistory };
