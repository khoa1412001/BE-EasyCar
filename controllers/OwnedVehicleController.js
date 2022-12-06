const {
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
  ErrorMsgPayload,
} = require("../payloads");
const Vehicle = require("../models/Vehicle");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");
const OwnedVehicleController = {
  GetOwnedVehicles: async (req, res) => {
    try {
      const ownedVehicle = await Vehicle.find(
        { ownerId: req.user.userId },
        "brand model fueltype transmission seats rating modelimage rentprice status"
      )
        .populate("ownerId", "location")
        .lean();
      SuccessDataPayload(res, ownedVehicle);
    } catch (error) {
      ErrorPayload(res, error);
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
      ErrorPayload(req, error);
    }
  },
  PostponeVehicle: async (req, res) => {
    try {
      const vehicleId = req.params.id;
      const vehicle = await Vehicle.findById(vehicleId);
      if (vehicle.ownerId.toString() !== req.user.userId) {
        throw new Error("Lỗi hệ thống");
      }
      vehicle.status = carStatusList.POSTPONE;
      await vehicle.save();
      return res.status(200).json({ message: "Tạm dừng xe thành công" });
    } catch (error) {
      ErrorPayload(req, error);
    }
  },
  ResumeVehicle: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const vehicle = await Vehicle.findById(vehicleId);
      if (vehicle.ownerId.toString() !== req.user.userId) {
        throw new Error("Lỗi hệ thống");
      }
      vehicle.status = carStatusList.ALLOW;
    } catch (error) {
      ErrorPayload(req, error);
    }
  },
  GetVehicleStatus: async (req, res) => {
    const vehicleId = req.params.id;
    try {
      const result = await VehicleStatus.find({ vehicleId: vehicleId }, "updatedAt").lean();
      return res.status(200).json({ data: result });
    } catch (error) {
      ErrorPayload(req, error);
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
      SuccessDataPayload(res, result);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
};
module.exports = OwnedVehicleController;