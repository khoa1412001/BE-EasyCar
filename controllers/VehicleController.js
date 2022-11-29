const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const registerVehicle = require("../models/VehicleRegister");
const { getVehicleBrand, getVehicleModel } = require("../models/VehicleModel");
const { uploadArray } = require("../utils/Cloudinary");
const carStatusList = require("../configs/CarStatus");
const errorPayload = require("../payloads/errorPayload");

async function RegisterVehicle(req, res) {
  try {
    //đổi trạng thái carowned của user
    // const user = User.findById(req.user.userId);
    // if (!user.carowner) {
    //   user.carowner = true;
    //   user.save();
    // }
    //kiem tra bien so xe sau
    const vehicle = await uploadArray(req.files);
    const newVehicle = new registerVehicle(req.body);
    newVehicle.vehicleimage = vehicle.map((item) => item.url);
    newVehicle.seats = newVehicle.type.split("-").pop();
    newVehicle.userId = req.user.userId;
    await newVehicle.save();
    return res.status(200).json({ message: "Đăng ký xe thành công" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
}
function GetModels(req, res) {
  const vehicleBranch = req.query.brand;
  if (!vehicleBranch) return res.status(200).json({ data: getVehicleBrand() });
  return res.status(200).json({ data: getVehicleModel(vehicleBranch) });
}
async function DetailVehicle(req, res) {
  const vehicleId = req.params.id;
  let startDate = new Date(Number(req.query.startdate) * 1000);
  let endDate = new Date(Number(req.query.enddate) * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  let diffInTime = endDate.getTime() - startDate.getTime();
  let days = Math.ceil(diffInTime / oneDay);
  try {
    const vehicle = await Vehicle.findById(vehicleId)
      .populate("ownerId", "username location avatar")
      .lean();
    vehicle.servicefee = Math.round(vehicle.rentprice * 0.1);
    vehicle.totalprice = Math.round(vehicle.rentprice * 1.1 * days);
    vehicle.basicinsurance = Math.round(vehicle.totalprice * 0.085);
    vehicle.premiuminsurance = Math.round(vehicle.totalprice * 0.15);
    vehicle.totalprice = Math.round(
      vehicle.totalprice + vehicle.basicinsurance
    );
    vehicle.days = days;
    return res.status(200).json({ data: vehicle });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Lỗi hệ thống" });
  }
}
async function DeleteVehicle(req, res) {
  const vehicleId = req.params.id;
  try {
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      ownerId: req.user.userId,
    });
    if (vehicle === null)
      return res.status(400).json({ message: "Không tìm thấy xe cần xóa" });
    await vehicle.delete();
    return res.status(200).json({ message: "Xóa xe thành công" });
  } catch (error) {
    errorPayload(req, error);
  }
}
async function PostponeVehicle(req, res) {
  try {
    const vehicleId = req.params.vehicle;
    const vehicle = await Vehicle.findById(vehicleId);
    if (vehicle.ownerId.toString() !== req.user.userId) {
      throw new Error("Lỗi hệ thống");
    }
    vehicle.status = carStatusList.POSTPONE;
    await vehicle.save();
    return res.status(200).json({ message: "Tạm dừng xe thành công" });
  } catch (error) {
    errorPayload(req, error);
  }
}
module.exports = { RegisterVehicle, GetModels, DetailVehicle, DeleteVehicle };
