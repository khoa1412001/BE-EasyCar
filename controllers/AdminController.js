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
const Report = require("../models/Report");

const AdminController = {
  //user
  GetUserList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page == 1) {
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
  GetDetailUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password").lean();
      if (!user) return ErrorMsgPayload(res, "Không tìm thấy người dùng");
      return SuccessDataPayload(res, user);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  SuspendUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return ErrorMsgPayload(res, "Không tìm thấy người dùng");
      user.status = false;
      await user.save();
      return SuccessMsgPayload(res, "Tạm dừng người dùng thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  ActivateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return ErrorMsgPayload(res, "Không tìm thấy người dùng");
      user.status = true;
      await user.save();
      return SuccessMsgPayload(res, "Tạm dừng người dùng thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  DeleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return ErrorMsgPayload(res, "Không tìm thấy người dùng");
      await user.delete();
      return SuccessMsgPayload(res, "Xóa người dùng thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  //vehicle
  GetVehicleList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page == 1) {
        let totalRequest = await Vehicle.countDocuments();
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await Vehicle.find()
        .select(
          "licenseplate brand model year fueltype fuelconsumption transmission type seats status"
        )
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
      return ErrorPayload(res, error);
    }
  },
  PostponeVehicle: async (req, res) => {
    try {
      const vehicleId = req.params.id;
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) return ErrorMsgPayload(res, "Không tìm thấy xe");
      vehicle.status = carStatusList.POSTPONE;
      await vehicle.save();
      return res.status(200).json({ message: "Tạm dừng xe thành công" });
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  ResumeVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) return ErrorMsgPayload(res, "Không tìm thấy xe");
      vehicle.status = carStatusList.ALLOW;
      await vehicle.save();
      return res.status(200).json({ message: "Tiếp tục cho thuê xe thành công" });
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  GetDetailVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const result = await Vehicle.findById(vehicleId)
        .populate("ownerId", "username email phoneNumber gender location")
        .lean();
      if (!result) return ErrorMsgPayload(res, "Không tìm thấy xe");
      return SuccessDataPayload(res, result);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  //register vehicle
  GetVehicleRegisterList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page == 1) {
        let totalRequest = await VehicleRegister.countDocuments({ status: statusList.PENDING });
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await VehicleRegister.find({ status: statusList.PENDING })
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
  GetVehicleRegisterDetail: async (req, res) => {
    try {
      const result = await VehicleRegister.findById(req.params.id).populate(
        "ownerId",
        "username email phoneNumber gender location"
      );
      if (!result) return ErrorMsgPayload(res, "Không tìm thấy xe đăng ký");
      return SuccessDataPayload(res, result);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  AcceptVehicleRegister: async (req, res) => {
    try {
      const register = await VehicleRegister.findById(req.params.id);
      if (!register) return ErrorMsgPayload(res, "Không tìm thấy đăng ký xe");
      register.status = statusList.ACCEPT;

      const clone = register.toJSON();
      delete clone._id;
      delete clone.createdAt;
      delete clone.updatedAt;
      delete clone.__v;
      delete clone.status;

      const vehicle = new Vehicle(clone);

      await vehicle.save();
      await register.save();

      return SuccessMsgPayload(res, "Chấp nhận đăng ký xe thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  DenyVehicleRegister: async (req, res) => {
    try {
      const register = await VehicleRegister.findById(req.params.id);
      if (!register) return ErrorMsgPayload(res, "Không tìm thấy đăng ký xe");
      register.status = statusList.DECLINE;
      await register.save();
      return SuccessMsgPayload(res, "Từ chối đăng ký xe thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  //verification
  GetVerificationList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page == 1) {
        let totalRequest = await UserVerificationRequest.countDocuments({
          status: statusList.PENDING,
        });
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await UserVerificationRequest.find({ status: statusList.PENDING })
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
  GetVerificationDetail: async (req, res) => {
    try {
      const result = await UserVerificationRequest.findById(req.params.id).lean();
      if (!result) return ErrorMsgPayload(res, "Không tìm thấy yêu cầu xác thực");
      return SuccessDataPayload(res, result);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  DenyVerification: async (req, res) => {
    try {
      const item = await UserVerificationRequest.findById(req.params.id);
      if (!item) return ErrorMsgPayload(res, "Không tìm thấy xác thực người dùng");
      item.status = statusList.DECLINE;
      await item.delete();
      return SuccessMsgPayload(res, "Từ chối xác thực người dùng thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  AcceptVerification: async (req, res) => {
    try {
      const verification = await UserVerificationRequest.findById(req.params.id);
      const user = await User.findById(verification.userId);
      user.fullname = verification.username;
      user.driverLicenseImg = verification.driverLicenseImg;
      user.driverLicenseNumber = verification.driverLicenseNumber;
      user.verification = true;
      user.bod = verification.bod;
      verification.status = statusList.ACCEPT;
      await verification.save();
      await user.save();
      return SuccessMsgPayload(res, "Chấp nhận xác thực người dùng thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  //withdraw
  GetWithdrawList: async (req, res) => {
    const perPage = 3;
    const page = req.query.page || 1;
    var totalPage = 0;
    try {
      if (page == 1) {
        let totalRequest = await WithdrawRequest.countDocuments();
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await WithdrawRequest.find()
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
      await User.findByIdAndUpdate(withdraw.userId, {
        $inc: { balance: withdraw.amount },
      });
      await withdraw.save();
      return SuccessMsgPayload(res, "Từ chối thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  AcceptWithdraw: async (req, res) => {
    try {
      const id = req.params.id;
      const withdraw = await WithdrawRequest.findById(id);
      withdraw.status = statusList.ACCEPT;
      await withdraw.save();
      return SuccessMsgPayload(res, "Chấp nhận thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  //report
  GetReportList: async (req, res) => {
    try {
      const perPage = 3;
      const page = req.query.page || 1;
      var totalPage = 0;
      if (page == 1) {
        let totalRepost = await Report.countDocuments({ status: false });
        totalPage = Math.ceil(totalRepost / perPage);
      }
      const result = await Report.find({ status: false })
        .populate("userId", "email username phoneNumber")
        .populate({
          path: "vehicleId",
          select: "brand model licenseplate year",
          populate: { path: "ownerId", select: "email username phoneNumber" },
        })
        .skip(perPage * (page - 1))
        .limit(perPage)
        .lean();
      return SuccessDataPayload(res, {
        totalPage: totalPage,
        data: result,
      });
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  AcceptReport: async (req, res) => {
    try {
      const id = req.params.id;
      const report = await Report.findById(id);
      report.status = true;
      await report.save();
      return SuccessMsgPayload(res, "Chấp nhận thành công!!!");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  DenyReport: async (req, res) => {
    try {
      const id = req.params.id;
      await Report.findByIdAndDelete(id);
      return SuccessMsgPayload(res, "Từ chối thành công!!!");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  ReportDetail: async (req, res) => {
    try {
      const id = req.params.id;
      const report = await Report.findById(id).lean();
      return SuccessDataPayload(res, report);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
};
module.exports = AdminController;
