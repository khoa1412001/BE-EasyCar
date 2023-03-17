var mongoose = require("mongoose"),
  Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");
const ObjectId = Schema.Types.ObjectId;

const ReportSchema = new Schema(
  {
    vehicleId: {
      type: ObjectId,
      ref: "Vehicle",
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    quality: {
      type: Boolean,
    },
    price: {
      type: Boolean,
    },
    owner: {
      type: Boolean,
    },
    other: {
      type: Boolean,
    },
    comment: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ReportSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
  indexFields: ["deleted", "deletedAt"],
});

module.exports = mongoose.model("Report", ReportSchema);
