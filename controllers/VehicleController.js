const Vehicle = require("../models/Vehicle");
const VehicleRegister = require("../models/VehicleRegister");
const VehicleStatus = require("../models/VehicleStatus");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");
const { getVehicleBrand, getVehicleModel } = require("../models/VehicleModel");
const { uploadArray } = require("../utils/Cloudinary");
const carStatusList = require("../configs/CarStatus");
const {
  ErrorMsgPayload,
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
} = require("../payloads");

const VehicleController = {
  RegisterVehicle: async (req, res) => {
    try {
      const checkPlate = await VehicleRegister.countDocuments({
        licenseplate: req.body.licenseplate,
      });
      if (checkPlate) return res.status(400).json({ message: "Biển số xe đã được đăng ký" });
      const vehicle = await uploadArray(req.files);
      const newVehicle = new VehicleRegister(req.body);
      newVehicle.vehicleimage = vehicle.map((item) => item.secure_url);
      newVehicle.seats = newVehicle.type.split("-").pop();
      newVehicle.ownerId = req.user.userId;
      await newVehicle.save();
      return res.status(200).json({ message: "Đăng ký xe thành công" });
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  GetModels: (req, res) => {
    const vehicleBranch = req.query.brand;
    if (!vehicleBranch) return res.status(200).json({ data: getVehicleBrand() });
    return res.status(200).json({ data: getVehicleModel(vehicleBranch) });
  },
  DetailVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    let startDate = new Date(Number(req.query.startdate) * 1000);
    let endDate = new Date(Number(req.query.enddate) * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    let diffInTime = endDate.getTime() - startDate.getTime();
    let days = Math.ceil(diffInTime / oneDay);
    try {
      const vehicle = await Vehicle.findById(vehicleId)
        .populate("ownerId", "username location avatar")
        .lean();
      vehicle.servicefee = Math.round(vehicle.rentprice * 0.1);
      vehicle.totalprice = Math.round(vehicle.rentprice * 1.1 * days);
      vehicle.basicinsurance = Math.round(vehicle.totalprice * 0.085);
      vehicle.premiuminsurance = Math.round(vehicle.totalprice * 0.15);
      vehicle.days = days;
      return res.status(200).json({ data: vehicle });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Lỗi hệ thống" });
    }
  },
  GetRateVehicle: async (req, res) => {
    try {
      const vehicleId = req.params.id;
      const data = await VehicleRentalHistory.find({
        vehicleId: vehicleId,
        rating: { $ne: 0 },
      })
        .select("rating comment")
        .populate({
          path: "userId",
          select: "username avatar -_id",
        })
        .lean();
      return SuccessDataPayload(res, data);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
};
module.exports = VehicleController;
