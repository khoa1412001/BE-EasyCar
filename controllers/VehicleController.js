const User = require("../models/User");
const Vehicle = require("../models/Vehicle");
const { getVehicleBrand, getVehicleModel } = require("../models/VehicleModel");
const { uploadArray } = require("../utils/Cloudinary");

async function AddVehicle(req, res) {
  try {
    const user = User.findById(req.user.userId);
    if (!user.carowner) {
      user.carowner = true;
      user.save();
    }

    const result = await uploadArray(req.files);
    const newVehicle = new Vehicle();

    newVehicle.userId = req.user.userId;

    //đổi trạng thái carowned của user
  } catch (error) {}
}
function GetModels(req, res) {
  const vehicleBranch = req.query.brand;
  if (!vehicleBranch) return res.status(200).json({ data: getVehicleBrand() });
  return res.status(200).json({ data: getVehicleModel(vehicleBranch) });
}
module.exports = { AddVehicle, GetModels };
