const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const registerVehicle = require("../models/Vehicle");
const { getVehicleBrand, getVehicleModel } = require("../models/VehicleModel");
const { uploadArray } = require("../utils/Cloudinary");

async function RegisterVehicle(req, res) {
  try {
    //đổi trạng thái carowned của user
    // const user = User.findById(req.user.userId);
    // if (!user.carowner) {
    //   user.carowner = true;
    //   user.save();
    // }
    //kiem tra bien so xe sau
    const result = await uploadArray(req.files);
    const newVehicle = new registerVehicle(req.body);
    newVehicle.vehicleimage = result.map((item) => item.url);
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
    const vehicle = Vehicle.findById(vehicleId).lean();
    vehicle.servicefee = Math.round(result.rentprice * 0.1 * days);
    vehicle.rentfee = Math.round(result.rentprice * days);
    vehicle.totalprice = Math.round(result.rentprice * 1.1 * days);
    return res.status(200).json({ data: vehicle });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({ message: "Lỗi hệ thống" });
  }
}
module.exports = { RegisterVehicle, GetModels };
