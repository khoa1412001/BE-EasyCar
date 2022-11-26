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
router.get("/rentalhistory", userController.GetRentalHistory);
router.get("/ownedvehicle", userController.GetOwnedVehicles);
router.post("/update-bank-info", userController.UpdateBankInfo);
module.exports = router;
