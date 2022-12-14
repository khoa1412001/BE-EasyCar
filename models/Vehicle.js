const mongoose = require("mongoose");
const mongoose_delete = require("mongoose-delete");
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
      default: 0,
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
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
VehicleSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
  indexFields: ["deleted", "deletedAt"],
});
module.exports = mongoose.model("Vehicle", VehicleSchema);
