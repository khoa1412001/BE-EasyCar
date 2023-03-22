const router = require("express").Router();
const adminController = require("../controllers/AdminController");

router.get("/user-list", adminController.GetUserList);
router.get("/detail-user/:id", adminController.GetDetailUser);
router.post("/suspend-user/:id", adminController.SuspendUser);
router.post("/activate-user/:id", adminController.ActivateUser);
router.delete("/delete-user/:id", adminController.DeleteUser);

router.get("/verify-list", adminController.GetVerificationList);
router.get("/verify-detail/:id", adminController.GetVerificationDetail);
router.post("/deny-verify/:id", adminController.DenyVerification);
router.post("/accept-verify/:id", adminController.AcceptVerification);

router.get("/vehicle-register-list", adminController.GetVehicleRegisterList);
router.get("/vehicle-register-detail/:id", adminController.GetVehicleRegisterDetail);
router.post("/accept-vehicle-register/:id", adminController.AcceptVehicleRegister);
router.post("/deny-vehicle-register/:id", adminController.DenyVehicleRegister);

router.get("/vehicle-list", adminController.GetVehicleList);
router.get("/vehicle-detail/:id", adminController.GetDetailVehicle);
router.delete("/delete-vehicle/:id", adminController.DeleteVehicle);
router.post("/postpone-vehicle/:id", adminController.PostponeVehicle);
router.post("/resume-vehicle/:id", adminController.ResumeVehicle);

router.get("/withdraw-list", adminController.GetWithdrawList);
router.post("/deny-withdraw/:id", adminController.DenyWithdraw);
router.post("/accept-withdraw/:id", adminController.AcceptWithdraw);

router.get("/report-list", adminController.GetReportList);

module.exports = router;
