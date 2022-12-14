const router = require("express").Router();
const adminController = require("../controllers/AdminController");

router.get("/user-list", adminController.GetUserList);
router.get("/detail-user/:id", adminController.GetDetailUser);
router.post("/suspend-user/:id", adminController.SuspendUser);
router.post("/activate-user/:id", adminController.ActivateUser);
router.delete("/delete-user/:id", adminController.DeleteUser);

router.get("/verify-list", adminController.GetVerificationList);
router.get("/vehicle-register-list", adminController.GetVehicleRegisterList);
router.get("/vehicle-list", adminController.GetVehicleList);
router.get("/withdraw-list", adminController.GetWithdrawList);
module.exports = router;
