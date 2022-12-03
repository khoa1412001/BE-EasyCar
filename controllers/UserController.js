const User = require("../models/User");
const UserVerificationRequest = require("../models/UserVerificationRequest");
const { uploadSingle, uploadArray } = require("../utils/Cloudinary");
const statusList = require("../configs/StatusList");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");
const Vehicle = require("../models/Vehicle");
const carStatusList = require("../configs/CarStatus");
const errorPayload = require("../payloads/errorPayload");
const WithdrawRequest = require("../models/WithdrawRequest");
const { findById } = require("../models/User");
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
    const result = await uploadSingle(req.file);
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
      userId: req.user.userId,
    })
      .populate({
        path: "vehicleId",
        select: "brand model fueltype transmission seats modelimage rating",
        options: { withDeleted: true },
        populate: {
          path: "ownerId",
          select: "location",
        },
      })
      .lean();
    rentalHistory.map((vehicle) => {
      vehicle.isrefundable = Date.now() < vehicle.rentalDateStart;
      delete vehicle.vehicleId.ownerId._id;
    });
    return res.status(200).json({ data: rentalHistory });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ message: "Không thể lấy được lịch sử thuê xe" });
  }
}

async function UpdateBankInfo(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    user.bank = req.body.bank;
    user.bankaccountname = req.body.bankaccountname;
    user.banknumber = Number(req.body.banknumber);
    await user.save();
    return res
      .status(200)
      .json({ message: "Cập nhật thông tin tài khoản thành công" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ message: "Lỗi hệ thống vui lòng thử lại sau" });
  }
}
async function AddHistoryRental(req, res) {
  try {
    const rentalDateEnd = new Date(Number(req.body.rentalDateEnd) * 1000);
    const rentalDateStart = new Date(Number(req.body.rentalDateStart) * 1000);
    const historyList = await VehicleRentalHistory.find({
      vehicleId: req.body.vehicleId,
      $or: [
        { rentalDateEnd: { $gt: Date.now() } },
        { rentalDateStart: { $gt: Date.now() } },
      ],
    }).lean();
    const checkResult = historyList.every(
      (item) =>
        rentalDateEnd < item.rentalDateStart ||
        rentalDateStart > item.rentalDateEnd
    );

    if (!checkResult)
      return res.status(200).json({
        message: "Lịch đăng ký xe đã bị trùng, vui lòng chọn lại ngày thuê xe",
      });

    const newRequest = new VehicleRentalHistory(req.body);
    newRequest.userId = req.user.userId;
    newRequest.rentalDateEnd = rentalDateEnd;
    newRequest.rentalDateStart = rentalDateStart;
    await newRequest.save();
    return res.status(200).json({ message: "Đăng ký xe thành công" });
  } catch (error) {
    errorPayload(res, error);
  }
}
async function GetWithdrawList(req, res) {
  try {
    const result = await WithdrawRequest.find({
      userId: req.user.userId,
    }).lean();
    return res.status(200).json({ data: result });
  } catch (error) {
    errorPayload(res, error);
  }
}
async function AddWithdrawRequest(req, res) {
  try {
    const amount = req.body.amount;
    const user = await User.findById(req.user.userId, "balance").lean();
    if (user.balance < amount)
      return res
        .status(400)
        .json({ message: "Không đủ số dư để thực hiện yêu cầu rút tiền" });
    const newBalance = user.balance - amount;

    await User.findByIdAndUpdate(req.user.userId, { balance: newBalance });
    const newRequest = new WithdrawRequest();
    newRequest.userId = req.user.userId;
    newRequest.amount = amount;
    await newRequest.save();
    return res.status(200).json({ message: "Tạo yêu cầu rút tiền thành công" });
  } catch (error) {
    errorPayload(res, error);
  }
}
async function GetDetailRentalHistoryOfOwnedVehicle(req, res) {
  try {
    const vehicleId = req.params.id;
    const result = await VehicleRentalHistory.find(
      { vehicleId: vehicleId },
      "rentalDateStart rentalDateEnd"
    )
      .populate("userId", "username")
      .lean();
    // result.map(item => remove item)
    return res.status(200).json({ data: result });
  } catch (error) {
    errorPayload(res, error);
  }
}
module.exports = {
  UpdateUser,
  UpdateAvatar,
  VerifyUser,
  GetRentalHistory,
  GetOwnedVehicles,
  UpdateBankInfo,
  AddHistoryRental,
  GetWithdrawList,
  AddWithdrawRequest,
  GetDetailRentalHistoryOfOwnedVehicle,
};
