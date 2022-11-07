var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

const TestSchema = new Schema({
    testName: {
        type: String
    }
})

module.exports = mongoose.model("Women", TestSchema);
