const mongoose = require("mongoose");
const statusList = require("../configs/StatusList");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const VehicleRegisterSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    brand: {
      type: String,
    },
    model: {
      type: String,
    },
    fueltype: {
      type: String,
    },
    fuelconsumption: {
      type: Number,
    },
    description: {
      type: String,
      default: "",
    },
    kmlimit: {
      type: Number,
      default: 0,
    },
    priceover: {
      type: Number,
      default: 0,
    },
    rentterm: {
      type: String,
      default: "",
    },
    year: {
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
    licenseplate: {
      type: String,
    },
    rentprice: {
      type: Number,
    },
    status: {
      type: Number,
      default: statusList.PENDING,
    },
    vehicleimage: {
      type: [String],
    },
    modelimage: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("VehicleRegister", VehicleRegisterSchema);
