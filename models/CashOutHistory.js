const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;
const CashOutHistorySchema = new Schema({
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
  appover: {
    type: String,
  },
});
module.exports = mongoose.model("CashOutHistories", CashOutHistorySchema);
