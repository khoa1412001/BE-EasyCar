const VehicleRentalHistory = require("../models/VehicleRentalHistory");
const VehicleRentalStatus = require("../models/VehicleRentalStatus");
const { uploadArray } = require("../utils/Cloudinary");
const {
  ErrorMsgPayload,
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
} = require("../payloads");

const RentalController = {
  AddHistoryRental: async (req, res) => {
    try {
      const rentalDateEnd = new Date(Number(req.body.rentalDateEnd) * 1000);
      const rentalDateStart = new Date(Number(req.body.rentalDateStart) * 1000);
      const historyList = await VehicleRentalHistory.find({
        vehicleId: req.body.vehicleId,
        $or: [{ rentalDateEnd: { $gt: Date.now() } }, { rentalDateStart: { $gt: Date.now() } }],
      }).lean();
      const checkResult = historyList.every(
        (item) => rentalDateEnd < item.rentalDateStart || rentalDateStart > item.rentalDateEnd
      );

      if (!checkResult)
        return res.status(200).json({
          message: "Lịch đăng ký xe đã bị trùng, vui lòng chọn lại ngày thuê xe",
        });

      const newRequest = new VehicleRentalHistory(req.body);
      newRequest.userId = req.user.userId;
      newRequest.rentalDateEnd = rentalDateEnd;
      newRequest.rentalDateStart = rentalDateStart;
      await newRequest.save();
      return res.status(200).json({ message: "Đăng ký xe thành công" });
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  GetRentalHistory: async (req, res) => {
    try {
      const rentalHistory = await VehicleRentalHistory.find({
        userId: req.user.userId,
      })
        .populate({
          path: "vehicleId",
          select: "brand model fueltype transmission seats modelimage rating",
          options: { withDeleted: true },
          populate: {
            path: "ownerId",
            select: "location",
          },
        })
        .lean();
      rentalHistory.map((vehicle) => {
        vehicle.isrefundable = Date.now() < vehicle.rentalDateStart;
        delete vehicle.vehicleId.ownerId._id;
      });
      return res.status(200).json({ data: rentalHistory });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({ message: "Không thể lấy được lịch sử thuê xe" });
    }
  },
  GetDetailRental: async (req, res) => {
    try {
      const rentalId = req.params.id;
      const result = await VehicleRentalHistory.findById(rentalId)
        .select("-userId")
        .populate({
          path: "vehicleId",
          populate: {
            path: "ownerId",
            select: "-_id location avatar phoneNumber username",
          },
        })
        .lean();
      let startDate = new Date(result.rentalDateStart);
      let endDate = new Date(result.rentalDateEnd);
      const oneDay = 1000 * 60 * 60 * 24;
      let diffInTime = endDate.getTime() - startDate.getTime();
      let days = Math.ceil(diffInTime / oneDay);
      result.days = days;
      SuccessDataPayload(res, result);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  UpdateVehicleStatus: async (req, res) => {
    try {
      const { id, engstatus, extstatus, intstatus } = req.body;
      const rental = new VehicleRentalStatus();
      rental.statusimage = [];
      rental.engstatus = engstatus;
      rental.extstatus = extstatus;
      rental.intstatus = intstatus;
      const uploadResult = await uploadArray([...req.files.statusimage, ...req.files.statusvideo]);
      uploadResult.map((item) => {
        if (item.folder === "statusimage") rental.statusimage.push(item.url);
        else rental.statusvideo = item.url;
      });
      const result = await rental.save();
      await VehicleRentalHistory.findByIdAndUpdate(id, {
        rentalStatusId: result._id,
        carstatusupdate: true,
      });
      SuccessMsgPayload(res, "Cập nhật trạng thái xe thành công");
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  GetDetailForStatusUpdate: async (req, res) => {
    try {
      const ownedVehicle = await VehicleRentalHistory.findById(req.params.id)
        .populate({
          path: "vehicleId",
          select: "-_id brand model year licenseplate",
        })
        .lean();
      SuccessDataPayload(res, ownedVehicle);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  GetRentalStatusDetail: async (req, res) => {
    try {
      const rentalHisotry = await VehicleRentalHistory.findById(req.params.id)
        .select("rentalDateStart rentalDateEnd")
        .populate({
          path: "vehicleId",
          select: "-_id brand model year licenseplate",
        })
        .populate({
          path: "rentalStatusId",
        })
        .lean();
      SuccessDataPayload(res, rentalHisotry);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
  GetContractData: async (req, res) => {
    try {
      const rentalHisotry = await VehicleRentalHistory.findById(req.params.id)
        .select("rentalDateStart rentalDateEnd createdAt rentprice totalPrice")
        .populate({
          path: "vehicleId",
          select: "brand model year licenseplate kmlimit priceover",
          options: { withDeleted: true },
          populate: {
            path: "ownerId",
            select: "location username phoneNumber socialId",
          },
        })
        .populate({
          path: "userId",
          select: "location username phoneNumber socialId",
        })
        .lean();
      SuccessDataPayload(res, rentalHisotry);
    } catch (error) {
      ErrorPayload(res, error);
    }
  },
};

module.exports = RentalController;
