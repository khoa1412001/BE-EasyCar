const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const VehicleSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  brand: {
    type: String,
  },
  model: {
    type: String,
  },
  transmission: {
    type: String,
  },
  type: {
    type: String,
  },
  seats: {
    type: Number,
  },
  location: {
    type: String,
  },
  carNumber: {
    type: String,
  },
  rentalDateStart: {
    type: Date,
  },
  rentalDateEnd: {
    type: Date,
  },
  price: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numberOfTrip: {
    type: Number,
  },
  status: {
    type: Boolean,
    default: false,
  },
});
module.exports = mongoose.model("Vehicle", VehicleSchema);
