const router = require("express").Router();
const adminController = require("../controllers/AdminController");
router.get("/user-list", adminController.GetUserList);
router.get("/verify-list", adminController.GetVerificationList);
router.get("/vehicle-register-list", adminController.GetVehicleRegisterList);
router.get("/vehicle-list", adminController.GetVehicleList);
router.get("/withdraw-list", adminController.GetWithdrawList);
module.exports = router;
