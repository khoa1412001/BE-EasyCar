const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;
const CashOutRequestSchema = new Schema({
  id: {
    type: String,
    default: uuid.v1,
  },
  userid: {
    type: String,
  },
  date: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    // sua lai enum sau
  },
});

module.exports = mongoose.model("CashOutRequest", CashOutRequestSchema);
