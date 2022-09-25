const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;
const CarSchema = new Schema({
  id: {
    type: String,
    default: uuid.v1,
  },
  userid: {
    type: String,
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
  },
  numberOfTrip: {
    type: Number,
  },
  status: {
    type: Boolean,
  },
});
module.exports = mongoose.model("cars", CarSchema);
