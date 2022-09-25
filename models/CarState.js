const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;
const CarStateSchema = new Schema({
  id: {
    type: String,
    default: uuid.v1,
  },
  carid: {
    type: String,
  },
  numberOfTrip: {
    type: Number,
  },
  status: {
    type: String,
  },
  img: {
    type: [String],
  },
  date: {
    type: Date,
  },
});
module.exports = mongoose.model("CarState", CarStateSchema);
