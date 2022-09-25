const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;
const CarRentalHistorySchema = new Schema({
  id: {
    type: String,
    default: uuid.v1,
  },
  userid: {
    type: String,
  },
  carid: {
    type: String,
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
module.exports = mongoose.model("CarRentalHistory", CarRentalHistorySchema);
