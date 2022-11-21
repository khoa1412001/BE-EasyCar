const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const carStatusList = require("../configs/CarStatus.js");
const VehicleSchema = new Schema(
  {
    ownerId: {
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
    rentalDateStart: {
      type: Date,
    },
    rentalDateEnd: {
      type: Date,
    },
    rentprice: {
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
      type: Number,
      default: carStatusList.ALLOW,
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
module.exports = mongoose.model("Vehicle", VehicleSchema);
