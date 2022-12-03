const router = require("express").Router();
const ownedVehicleController = require("../controllers/OwnedVehicleController");

// router.get("/list");
router.get("/owned-vehicle", ownedVehicleController.GetOwnedVehicles);

router.get("/vehicle-rental-list/:id", ownedVehicleController.GetDetailVehicle);
module.exports = router;
