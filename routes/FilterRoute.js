const router = require("express").Router();
const filterController = require("../controllers/FilterController");

router.post("/", filterController.GetVehicleWithFilter);

module.exports = router;
