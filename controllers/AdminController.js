const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const UserVerificationRequest = require("../models/UserVerificationRequest");
const VehicleRegister = require("../models/VehicleRegister");
const WithdrawRequest = require("../models/WithdrawRequest");

const roleList = require("../configs/RoleList");
const statusList = require("../configs/StatusList");
const carStatusList = require("../configs/CarStatus");

const {
  ErrorMsgPayload,
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
} = require("../payloads");

const AdminController = {
  GetUserList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page === 1) {
        let totalUser = await User.countDocuments({ role: roleList.CUSTOMER });
        totalPage = Math.ceil(totalUser / perPage);
      }
      const data = await User.find({ role: roleList.CUSTOMER })
        .select("email username phoneNumber location status verification avatar")
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();
      return res.status(200).json({
        totalPage: totalPage,
        data: data,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Lỗi hệ thống" });
    }
  },
  GetVehicleList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page === 1) {
        let totalRequest = await Vehicle.countDocuments();
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await Vehicle.find()
        .select("licenseplate brand model year fueltype fuelconsumption transmission type seats")
        .populate("ownerId", "email username phoneNumber")
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();
      return res.status(200).json({ totalPage: totalPage, data: data });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Lỗi hệ thống" });
    }
  },

  GetVehicleRegisterList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page === 1) {
        let totalRequest = await VehicleRegister.countDocuments();
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await VehicleRegister.find()
        .select("licenseplate brand model year fueltype fuelconsumption transmission type seats")
        .populate("ownerId", "email username phoneNumber")
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();
      return res.status(200).json({ totalPage: totalPage, data: data });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Lỗi hệ thống" });
    }
  },
  GetVerificationList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page === 1) {
        let totalRequest = await UserVerificationRequest.countDocuments();
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await UserVerificationRequest.find()
        .select("username driverLicenseNumber bod")
        .populate("userId", "avatar email phoneNumber location")
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();
      return res.status(200).json({
        totalPage: totalPage,
        data: data,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Lỗi hệ thống" });
    }
  },
  GetWithdrawList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page === 1) {
        let totalRequest = await WithdrawRequest.countDocuments({ status: statusList.PENDING });
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await WithdrawRequest.find({ status: statusList.PENDING })
        .populate(
          "userId",
          "avatar email username bank banknumber bankaccountname phoneNumber location"
        )
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();
      return res.status(200).json({
        totalPage: totalPage,
        data: data,
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Lỗi hệ thống" });
    }
  },
  DenyWithdraw: async (req, res) => {
    try {
      const id = req.params.id;
      const withdraw = await WithdrawRequest.findById(id);
      withdraw.status = statusList.DECLINE;
      await User.findByIdAndUpdate(withdraw.userId, { $inc: { balance: withdraw.amount } });
      await withdraw.save();
      SuccessMsgPayload(res, "Từ chối thành công");
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  AcceptWithdraw: async (req, res) => {
    try {
      const id = req.params.id;
      const withdraw = await WithdrawRequest.findById(id);
      withdraw.status = statusList.ACCEPT;
      await withdraw.save();
      SuccessMsgPayload(res, "Chấp nhận thành công");
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  DeleteVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
      });
      if (vehicle === null) return res.status(400).json({ message: "Không tìm thấy xe cần xóa" });
      await vehicle.delete();
      return res.status(200).json({ message: "Xóa xe thành công" });
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  PostponeVehicle: async (req, res) => {
    try {
      const vehicleId = req.params.id;
      await Vehicle.findByIdAndUpdate(vehicleId, { status: carStatusList.POSTPONE });
      return res.status(200).json({ message: "Tạm dừng xe thành công" });
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  ResumeVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      await Vehicle.findByIdAndUpdate(vehicleId, { status: carStatusList.ALLOW });
      return res.status(200).json({ message: "Tiếp tục cho thuê xe thành công" });
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  GetDetailVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const result = await Vehicle.findById(vehicleId).lean();
      if (!result) ErrorMsgPayload(res, "Không tìm thấy xe");
      SuccessDataPayload(res, result);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  AcceptVehicleRegister: async (req, res) => {},
  DenyVehicleRegister: async (req, res) => {},
};
module.exports = AdminController;
