const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const insuranceType = require("../configs/InsuranceType.js");
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
  rentalStatusId: {
    type: ObjectId,
    ref: "VehicleRentalStatus",
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
  comment: {
    type: String,
  },
  insurance: {
    type: Number,
  },
  insurancetype: {
    type: Number,
  },
  servicefee: {
    type: Number,
  },
  rentprice: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
  carstatusupdate: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  },
  { timestamps: true }
);
module.exports = mongoose.model(
  "VehicleRentalHistory",
  VehicleRentalHistorySchema
);
