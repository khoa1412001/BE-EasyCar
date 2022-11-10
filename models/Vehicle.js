const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const VehicleSchema = new Schema(
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
      type: Boolean,
      default: false,
    },
    vehicleimage: {
      type: [String],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Vehicle", VehicleSchema);
