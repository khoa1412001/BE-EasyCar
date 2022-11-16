const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const CarRentalStatusSchema = new Schema({
  carId: {
    type: ObjectId,
    ref: "Vehicle",
    required: true,
  },
  engstatus: {
    type: String,
    default:"",
  },
  intstatus: {
    type: String,
    default:"",
  },
  extstatus: {
    type: String,
    default:"",
  },
  statusimage: {
    type: [String],
    default:[],
  },

},
{ timestamps: true });
module.exports = mongoose.model("CarRentalStatus", CarRentalStatusSchema);
