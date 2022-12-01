const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const VehicleStatusSchema = new Schema(
  {
    vehicleId: {
      type: ObjectId,
      ref: "Vehicle",
      required: true,
    },
    engstatus: {
      type: String,
      default: "",
    },
    intstatus: {
      type: String,
      default: "",
    },
    extstatus: {
      type: String,
      default: "",
    },
    statusimage: {
      type: [String],
    },
    statusvideo: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("VehicleStatus", VehicleStatusSchema);
