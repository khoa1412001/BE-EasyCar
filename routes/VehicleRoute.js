const router = require("express").Router();
const vehicleController = require("../controllers/VehicleController");
const parser = require("../middlewares/Parser");
const passport = require("../middlewares/VerifyJWT");
router.post("/register", passport, parser.array("vehicleimage"), vehicleController.RegisterVehicle);
router.get("/models", vehicleController.GetModels);
router.get("/detail/:id", vehicleController.DetailVehicle);
module.exports = router;
