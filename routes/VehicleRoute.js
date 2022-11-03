const router = require("express").Router();
const vehicleController = require("../controllers/VehicleController");
const parser = require("../middlewares/Parser");
const passport = require("../middlewares/VerifyJWT");
router.post(
  "/add-vehicle",
  passport,
  parser.array("vehicle"),
  vehicleController.AddVehicle
);
module.exports = router;
