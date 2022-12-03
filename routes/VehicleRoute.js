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
router.get("/detail/:id", vehicleController.DetailVehicle);
router.delete("/delete/:id", passport, vehicleController.DeleteVehicle);
router.post("/postpone/:id", passport, vehicleController.PostponeVehicle);
router.get("/status/:id", passport, vehicleController.GetVehicleStatus);
module.exports = router;
