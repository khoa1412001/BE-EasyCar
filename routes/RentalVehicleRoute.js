const router = require("express").Router();
const rentalController = require("../controllers/RentalController");
const parser = require("../middlewares/Parser");

router.post("/add-contract", rentalController.AddHistoryRental);
router.get("/list", rentalController.GetRentalHistory);
router.get("/:id", rentalController.GetDetailRental);
router.post(
  "/update-status",
  parser.fields([{ name: "statusimage" }, { name: "statusvideo" }]),
  rentalController.UpdateVehicleStatus
);

module.exports = router;
