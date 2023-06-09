const {
  ErrorPayload,
  ErrorMsgPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
} = require("../payloads");
const Report = require("../models/Report");
const VehicleRentalHistory = require("../models/VehicleRentalHistory");

const ReportController = {
  GetReportInfo: async (req, res) => {
    try {
      const idRental = req.params.id;
      const reportData = await VehicleRentalHistory.findOne({
        _id: idRental,
        userId: req.user.userId,
      })
        .select("vehicleId")
        .populate("vehicleId", "brand model licenseplate year")
        .lean();
      return SuccessDataPayload(res, reportData);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  ReportVehicle: async (req, res) => {
    try {
      const newReport = new Report();
      newReport.vehicleId = req.body.vehicleId;
      newReport.userId = req.user.userId;
      newReport.quality = req.body.quality;
      newReport.price = req.body.price;
      newReport.owner = req.body.owner;
      newReport.other = req.body.other;
      newReport.comment = req.body.comment;
      await newReport.save();
      return SuccessMsgPayload(res, "Báo cáo thành công");
    } catch (error) {
      return ErrorMsgPayload(res, error, "Báo cáo thất bại vui lòng thử lại sau");
    }
  },
};
module.exports = ReportController;
