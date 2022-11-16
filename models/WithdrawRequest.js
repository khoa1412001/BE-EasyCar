const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const WithdrawRequestSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: Number,
    default: statusList.PENDING,
  },
},
{ timestamps: true });
module.exports = mongoose.model("WithdrawRequest", WithdrawRequestSchema);
