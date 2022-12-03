const router = require("express").Router();
const rentalController = require("../controllers/RentalController");

router.post("/add-contract", rentalController.AddHistoryRental);
router.get("/rental-history", rentalController.GetRentalHistory);

module.exports = router;
