const router = require("express").Router();
const controller = require("../controllers/ReportController");
router.get("/:id", controller.GetReportInfo);
router.post("/create", controller.ReportVehicle);
module.exports = router;
