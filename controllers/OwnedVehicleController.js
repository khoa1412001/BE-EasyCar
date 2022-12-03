const {
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
  ErrorMsgPayload,
} = require("../payloads");

const OwnedVehicleController = {
  GetOwnedVehicles: async (req, res) => {
    try {
      const ownedVehicle = await Vehicle.find(
        { ownerId: req.user.userId },
        "brand model fueltype transmission seats rating modelimage rentprice"
      )
        .populate("ownerId", "location")
        .lean();
      SuccessDataPayload(res, ownedVehicle);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  GetDetailVehicle: async (req, res) => {
    try {
      const vehicleId = req.params.id;
      const result = await VehicleRentalHistory.find(
        { vehicleId: vehicleId },
        "rentalDateStart rentalDateEnd"
      )
        .populate("userId", "username")
        .lean();
      result.map((item) => delete item.userId._id);
      SuccessDataPayload(res, result);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
};
module.exports = OwnedVehicleController;
