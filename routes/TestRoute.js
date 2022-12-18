const parser = require("../middlewares/Parser");
const Vehicle = require("../models/Vehicle");
const VehicleStatus = require("../models/VehicleStatus");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const id = "636d0a7dd1b74ac73941190a";
    const vehicle = await Vehicle.findById(id).populate("ownerId");
    console.log("before", vehicle.ownerId.username);
    vehicle.ownerId.username = "Anh Khoe";
    console.log("after", vehicle.ownerId.username);
    await vehicle.save();
    const vehicle2 = await Vehicle.findById(id).populate("ownerId");
    console.log("test", vehicle2.ownerId.username);
    return res.status(200).json({ message: "thanh cong bro" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
