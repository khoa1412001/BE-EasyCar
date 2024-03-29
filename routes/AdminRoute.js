const router = require("express").Router();
const adminController = require("../controllers/AdminController");

router.post("/user-list", adminController.GetUserList);
router.get("/detail-user/:id", adminController.GetDetailUser);
router.post("/suspend-user/:id", adminController.SuspendUser);
router.post("/activate-user/:id", adminController.ActivateUser);
router.delete("/delete-user/:id", adminController.DeleteUser);

router.post("/verify-list", adminController.GetVerificationList);
router.get("/verify-detail/:id", adminController.GetVerificationDetail);
router.post("/deny-verify/:id", adminController.DenyVerification);
router.post("/accept-verify/:id", adminController.AcceptVerification);

router.post("/vehicle-register-list", adminController.GetVehicleRegisterList);
router.get("/vehicle-register-detail/:id", adminController.GetVehicleRegisterDetail);
router.post("/accept-vehicle-register/:id", adminController.AcceptVehicleRegister);
router.post("/deny-vehicle-register/:id", adminController.DenyVehicleRegister);

router.post("/vehicle-list", adminController.GetVehicleList);
router.get("/vehicle-detail/:id", adminController.GetDetailVehicle);
router.delete("/delete-vehicle/:id", adminController.DeleteVehicle);
router.post("/postpone-vehicle/:id", adminController.PostponeVehicle);
router.post("/resume-vehicle/:id", adminController.ResumeVehicle);

router.post("/withdraw-list", adminController.GetWithdrawList);
router.post("/deny-withdraw/:id", adminController.DenyWithdraw);
router.post("/accept-withdraw/:id", adminController.AcceptWithdraw);

router.post("/report-list", adminController.GetReportList);
router.get("/report-detail/:id", adminController.ReportDetail);
router.post("/accept-report/:id", adminController.AcceptReport);
router.post("/deny-report/:id", adminController.DenyReport);

module.exports = router;
