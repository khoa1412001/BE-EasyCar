const mongoose = require("mongoose");
var uuid = require("node-uuid");
const Schema = mongoose.Schema;
const CoDriver = new Schema({
  id: {
    type: String,
    default: uuid.v1,
  },
  userid: {
    type: String,
  },
  name: {
    type: String,
  },
  phonenumber: {
    type: String,
  },
  email: {
    type: String,
  },

  driverlicenseimg: {
    type: String,
  },
  selfieimg: {
    type: String,
  },
  socialimg: {
    type: String,
  },
  verification: {
    type: Boolean,
  },
});
module.exports = mongoose.model("CoDriver", CoDriverSchema);
