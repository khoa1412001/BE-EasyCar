const roleList = require("../configs/RoleList");
const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const RegisterVehicle = require("../models/VehicleRegister");
const UserVerificationRequest = require("../models/UserVerificationRequest");
const VehicleRegister = require("../models/VehicleRegister");
const statusList = require("../configs/StatusList");
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
        let totalRequest = await PaymentRequest.countDocuments({ status: statusList.PENDING });
        totalPage = Math.ceil(totalRequest / perPage);
      }
      const data = await PaymentRequest.find({ status: statusList.PENDING })
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
};
module.exports = AdminController;
