const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
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

    const result = await uploadArray(req.files);
    const newVehicle = new Vehicle(req.body);
    newVehicle.vehicleimage = result.map((item) => item.url);
    newVehicle.seats = newVehicle.type.split("-").pop();
    newVehicle.userId = req.user.userId;
  } catch (error) {}
}
function GetModels(req, res) {
  const vehicleBranch = req.query.brand;
  if (!vehicleBranch) return res.status(200).json({ data: getVehicleBrand() });
  return res.status(200).json({ data: getVehicleModel(vehicleBranch) });
}
module.exports = { RegisterVehicle, GetModels };
