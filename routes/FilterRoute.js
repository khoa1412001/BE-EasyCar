const router = require("express").Router();
const filterController = require("../controllers/FilterController");

router.post("/", filterController.GetVehicleWithFilter);
router.get("/text", filterController.TextFilter);
module.exports = router;
