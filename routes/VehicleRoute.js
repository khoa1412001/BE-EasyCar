const router = require("express").Router;
const vehicleController = require("../controllers/VehicleController");
const uploadImage = require("../middlewares/UploadImage");
const passport = require("../middlewares/VerifyJWT");
// router.post(
//   "/add-vehicle",
//   passport,
//   uploadImage.array("vehicle"),
//   vehicleController.AddVehicle
// );
module.exports = router;
