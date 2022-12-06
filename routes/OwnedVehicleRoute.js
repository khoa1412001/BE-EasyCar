const router = require("express").Router();
const ownedVehicleController = require("../controllers/OwnedVehicleController");

router.get("/list", ownedVehicleController.GetOwnedVehicles);
router.get("/history/:id", ownedVehicleController.GetHistoryRental);
router.get("/status/:id", ownedVehicleController.GetVehicleStatus);
router.delete("/delete/:id", ownedVehicleController.DeleteVehicle);
router.post("/postpone/:id", ownedVehicleController.PostponeVehicle);
router.post("/resume/:id", ownedVehicleController.ResumeVehicle);
module.exports = router;
