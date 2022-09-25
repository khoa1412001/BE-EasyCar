const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;
const CarRentalContactSchema = new Schema({
  id: {
    type: String,
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
  sign: {
    type: String,
  },
  coordinate: {
    type: String,
  },
});
module.exports = mongoose.model("CarRentalContact", CarRentalContactSchema);
