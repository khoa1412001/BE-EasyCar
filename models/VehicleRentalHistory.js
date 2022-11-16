const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const VehicleRentalHistorySchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  vehicleId: {
    type: ObjectId,
    ref: "Vehicle",
    required: true,
  },
  rentalDateStart: {
    type: Date,
  },
  rentalDateEnd: {
    type: Date,
  },
  rating: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
  },
});
module.exports = mongoose.model(
  "VehicleRentalHistory",
  VehicleRentalHistorySchema
);
