async function GetOwnedVehicles(req, res) {
  try {
    const ownedVehicle = await Vehicle.find(
      { ownerId: req.user.userId },
      "brand model fueltype transmission seats rating modelimage rentprice"
    )
      .populate("ownerId", "location")
      .lean();
    return res.status(200).json({ data: ownedVehicle });
  } catch (error) {
    console.log(error.message);
    return res
      .status(400)
      .json({ message: "Đã xảy ra lỗi vui lòng thử lại sau!" });
  }
}
module.exports = { GetOwnedVehicles };
