const parser = require("../middlewares/Parser");
const VehicleStatus = require("../models/VehicleStatus");

const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const newOne = new VehicleStatus();
    newOne.vehicleId = "636d0a7dd1b74ac73941190a";
    await newOne.save();
    return res.status(200).json({ message: "thanh cong bro" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
