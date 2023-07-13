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
      // const checkPlate = await VehicleRegister.countDocuments({
      //   licenseplate: req.body.licenseplate,
      // });
      // if (checkPlate) return res.status(400).json({ message: "Biển số xe đã được đăng ký" });
      if ((req.body.longitude == 0) && (req.body.latitude == 0)) return res.status(400).json({ message: "Hãy cập nhật vị trí của bạn !!!" });
  
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
        .select("rating comment createdAt")
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

  GetRecommendation: async (req, res) => {
    let startDate = new Date(Number(req.query.startdate) * 1000);
    let endDate = new Date(Number(req.query.enddate) * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    let diffInTime = endDate.getTime() - startDate.getTime();
    let days = Math.ceil(diffInTime / oneDay);
    try {
      const vehicleId = req.params.id;
      const cardata = await Vehicle.findById(vehicleId).lean();
      var data = [];
      const getCarType = cardata.type;
      const recommendationdata = await Vehicle.find({type: getCarType, _id: {$ne: cardata._id}}).sort('rating').lean();
      const remain = 10 - recommendationdata.length;
      data = recommendationdata;
      if(remain >= 0 ) {
        const filler = await Vehicle.find({type:{$ne:getCarType}, _id: {$ne: cardata._id}}).sort('rating').limit(remain).lean();
        data = recommendationdata.concat(filler);
      }
      data.map((result) => {
        result.totalprice = Math.round(result.rentprice * 1.1 * days);
        result.basicinsurance = Math.round(result.totalprice * 0.085);
        result.totalprice = Math.round(result.totalprice + result.basicinsurance);
      });
      return SuccessDataPayload(res, data);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
};
module.exports = VehicleController;
