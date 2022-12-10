const router = require("express").Router();
const rentalController = require("../controllers/RentalController");

router.post("/add-contract", rentalController.AddHistoryRental);
router.get("/list", rentalController.GetRentalHistory);
router.get("/:id", rentalController.GetDetailRental);

module.exports = router;
