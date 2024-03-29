const VehicleRentalHistory = require("../models/VehicleRentalHistory");
const VehicleRentalStatus = require("../models/VehicleRentalStatus");
const { uploadArray } = require("../utils/Cloudinary");
const {
  ErrorMsgPayload,
  ErrorPayload,
  SuccessDataPayload,
  SuccessMsgPayload,
} = require("../payloads");
const Vehicle = require("../models/Vehicle");
const User = require("../models/User");
const RentalController = {
  AddHistoryRental: async (req, res) => {
    try {
      const rentalDateEnd = new Date(Number(req.body.rentalDateEnd) * 1000);
      const rentalDateStart = new Date(Number(req.body.rentalDateStart) * 1000);
      const historyList = await VehicleRentalHistory.find({
        vehicleId: req.body.vehicleId,
        $and: [{ rentalDateEnd: { $gt: Date.now() } }, { rentalDateStart: { $gt: Date.now() } }],
      }).lean();
      const checkResult = historyList.every(
        (item) => rentalDateEnd < item.rentalDateStart || rentalDateStart > item.rentalDateEnd
      );
      const user = await User.findById(req.user.userId);
      if(!user.verification){
        return res.status(400).json({
          message: "Vui lòng xác thực tài khoản để thuê xe !!!",
        });
      }
      if (!checkResult)
        return res.status(400).json({
          message: "Lịch đăng ký xe đã bị trùng, vui lòng chọn lại ngày thuê xe",
        });

      const newRequest = new VehicleRentalHistory(req.body);
      newRequest.userId = req.user.userId;
      newRequest.rentalDateEnd = rentalDateEnd;
      newRequest.rentalDateStart = rentalDateStart;
      await newRequest.save();
      return res.status(200).json({ message: "Đăng ký xe thành công" });
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  GetRentalHistory: async (req, res) => {
    try {
      const rentalHistory = await VehicleRentalHistory.find({
        userId: req.user.userId,
      })
        .populate({
          path: "vehicleId",
          select: "brand model fueltype transmission seats modelimage rating vehicleimage year",
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
      return SuccessDataPayload(res, result);
    } catch (error) {
      return ErrorPayload(res, error);
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
        if (item.folder === "statusimage") rental.statusimage.push(item.secure_url);
        else rental.statusvideo = item.secure_url;
      });
      const result = await rental.save();
      await VehicleRentalHistory.findByIdAndUpdate(id, {
        rentalStatusId: result._id,
        carstatusupdate: true,
      });
      return SuccessMsgPayload(res, "Cập nhật trạng thái xe thành công");
    } catch (error) {
      return ErrorPayload(res, error);
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
      return SuccessDataPayload(res, ownedVehicle);
    } catch (error) {
      return ErrorPayload(res, error);
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
      return SuccessDataPayload(res, rentalHisotry);
    } catch (error) {
      return ErrorPayload(res, error);
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
      return SuccessDataPayload(res, rentalHisotry);
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
  RateRentalVehicle: async (req, res) => {
    try {
      //thêm rating và comment
      const rental = await VehicleRentalHistory.findOne({
        _id: req.params.id,
        userId: req.user.userId,
      });
      if (!rental) return ErrorMsgPayload(res, "Không tìm thấy lịch sử thuê xe");

      rental.rating = req.body.rating;
      rental.comment = req.body.comment;
      const vehicleId = rental.vehicleId;
      await rental.save();
      //tính trung bình rating
      const totalRating = await VehicleRentalHistory.find({
        vehicleId: vehicleId,
        rating: { $ne: 0 },
      })
        .select("rating")
        .lean();
      var rating = totalRating.reduce((prev, curr) => prev + curr.rating, 0);
      rating = Math.round((rating / totalRating.length) * 10) / 10;
      await Vehicle.findByIdAndUpdate(vehicleId, { rating: rating });
      return SuccessMsgPayload(res, "Đánh giá thành công");
    } catch (error) {
      return ErrorPayload(res, error);
    }
  },
};

module.exports = RentalController;
