const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const VehicleRentalHistorySchema = new Schema({
  userid: {
    type: ObjectId,
    ref: "User",
  },
  carid: {
    type: ObjectId,
    ref: "Vehicle",
  },
  rentalDateStart: {
    type: Date,
  },
  rentalDateEnd: {
    type: Date,
  },
  rating: {
    type: Number,
  },
  totalPrice: {
    type: Number,
  },
});
module.exports = mongoose.model(
  "VehicleRentalHistory",
  VehicleRentalHistorySchema
);
