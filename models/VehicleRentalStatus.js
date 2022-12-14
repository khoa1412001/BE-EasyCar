const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const VehicleRentalStatusSchema = new Schema(
  {
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
      default: [],
    },
    statusvideo: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("VehicleRentalStatus", VehicleRentalStatusSchema);
