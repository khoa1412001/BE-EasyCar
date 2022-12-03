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
      errorPayload(res, error);
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
};

module.exports = RentalController;
