const {
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
  ErrorMsgPayload,
} = require("../payloads");
const Vehicle = require("../models/Vehicle");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");
const VehicleStatus = require("../models/VehicleStatus");
const carStatusList = require("../configs/CarStatus.js");
const { uploadArray, uploadSingle } = require("../utils/Cloudinary");
const OwnedVehicleController = {
  GetOwnedVehicles: async (req, res) => {
    try {
      const ownedVehicle = await Vehicle.find(
        { ownerId: req.user.userId },
        "brand model fueltype transmission seats rating modelimage rentprice status"
      )
        .populate("ownerId", "location")
        .lean();
      return SuccessDataPayload(res, ownedVehicle);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  DeleteVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        ownerId: req.user.userId,
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
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        ownerId: req.user.userId,
      });
      if (!vehicle) ErrorMsgPayload(res, "Không tìm thấy xe");
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
      const vehicle = await Vehicle.findOne({
        _id: vehicleId,
        ownerId: req.user.userId,
      });
      if (!vehicle) ErrorMsgPayload(res, "Không tìm thấy xe");
      vehicle.status = carStatusList.ALLOW;
      await vehicle.save();
      return res.status(200).json({ message: "Tiếp tục cho thuê xe thành công" });
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  GetVehicleStatus: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const result = await VehicleStatus.find({ vehicleId: vehicleId }, "createdAt").lean();
      return res.status(200).json({ data: result });
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  GetHistoryRental: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const result = await VehicleRentalHistory.find(
        { vehicleId },
        "rentalDateStart rentalDateEnd totalPrice"
      )
        .populate("userId", "username -_id")
        .lean();
      return SuccessDataPayload(res, result);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  GetDetailRental: async (req, res) => {
    try {
      const rentalId = req.params.id;
      const result = await VehicleRentalHistory.findById(rentalId)
        .populate({
          path: "userId",
          select: "-_id avatar phoneNumber username",
        })
        .populate("vehicleId")
        .lean();
      let startDate = new Date(result.rentalDateStart);
      let endDate = new Date(result.rentalDateEnd);
      const oneDay = 1000 * 60 * 60 * 24;
      let diffInTime = endDate.getTime() - startDate.getTime();
      let days = Math.ceil(diffInTime / oneDay);
      result.days = days;
      return SuccessDataPayload(res, result);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  GetDetailStatus: async (req, res) => {
    const rentalStatusId = req.params.id;
    try {
      const result = await VehicleStatus.findById(rentalStatusId)
        .populate({
          path: "vehicleId",
          select: "brand model year licenseplate",
        })
        .lean();
      return SuccessDataPayload(res, result);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  UpdateVehicleStatus: async (req, res) => {
    try {
      const { id, engstatus, extstatus, intstatus } = req.body;
      const rental = new VehicleStatus();
      rental.statusimage = [];
      rental.vehicleId = id;
      rental.engstatus = engstatus;
      rental.extstatus = extstatus;
      rental.intstatus = intstatus;
      const uploadResult = await uploadArray([...req.files.statusimage, ...req.files.statusvideo]);
      uploadResult.map((item) => {
        if (item.folder === "statusimage") rental.statusimage.push(item.secure_url);
        else rental.statusvideo = item.secure_url;
      });
      await rental.save();
      return SuccessMsgPayload(res, "Cập nhật trạng thái xe thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  GetDetailForStatusUpdate: async (req, res) => {
    try {
      const ownedVehicle = await Vehicle.findById(
        req.params.id,
        "brand model year licenseplate"
      ).lean();
      return SuccessDataPayload(res, ownedVehicle);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
};
module.exports = OwnedVehicleController;
