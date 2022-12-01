const router = require("express").Router();
const vehicleController = require("../controllers/VehicleController");
const parser = require("../middlewares/Parser");
const passport = require("../middlewares/VerifyJWT");
router.post(
  "/register",
  passport,
  parser.array("vehicleimage"),
  vehicleController.RegisterVehicle
);
router.get("/models", vehicleController.GetModels);
router.get("/:id", vehicleController.DetailVehicle);
router.delete("/:id", passport, vehicleController.DeleteVehicle);
router.post("/:vehicle", passport, vehicleController.PostponeVehicle);
router.get("/status/:id", passport, vehicleController.GetVehicleStatus);
module.exports = router;
