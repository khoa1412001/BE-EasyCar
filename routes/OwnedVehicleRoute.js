const router = require("express").Router();
const ownedVehicleController = require("../controllers/OwnedVehicleController");
const parser = require("../middlewares/Parser");

router.get("/list", ownedVehicleController.GetOwnedVehicles);
router.get("/history/:id", ownedVehicleController.GetHistoryRental);
router.get("/status/:id", ownedVehicleController.GetVehicleStatus);
router.delete("/delete/:id", ownedVehicleController.DeleteVehicle);
router.post("/postpone/:id", ownedVehicleController.PostponeVehicle);
router.post("/resume/:id", ownedVehicleController.ResumeVehicle);
router.get("/detail/:id", ownedVehicleController.GetDetailRental);
router.get(
  "/detail-status/:id",
  parser.fields([{ name: "statusimage" }, { name: "statusvideo" }]),
  ownedVehicleController.GetDetailStatus
);
module.exports = router;
