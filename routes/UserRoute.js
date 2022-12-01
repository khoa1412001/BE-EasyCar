const router = require("express").Router();
const userController = require("../controllers/UserController");
const passport = require("../middlewares/VerifyJWT");
const parser = require("../middlewares/Parser");

router.post("/update", userController.UpdateUser);
//update-avatar
router.post(
  "/update-avatar",
  parser.single("avatar"),
  userController.UpdateAvatar
);
//verify-user
router.post(
  "/verify",
  parser.single("driverlincenseimg"),
  userController.VerifyUser
);
router.get("/rental-history", userController.GetRentalHistory);
router.get("/owned-vehicle", userController.GetOwnedVehicles);
router.post("/update-bank-info", userController.UpdateBankInfo);
router.post("/add-contract", userController.AddHistoryRental);
router.get("/withdraw-list", userController.GetWithdrawList);
router.post("/withdraw", userController.AddWithdrawRequest);
router.get(
  "/vehicle-rental-list/:id",
  userController.GetDetailRentalHistoryOfOwnedVehicle
);
module.exports = router;
