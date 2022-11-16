const router = require("express").Router();
const userController = require("../controllers/UserController");
const passport = require("../middlewares/VerifyJWT");
const parser = require("../middlewares/Parser");

router.post("/update", userController.UpdateUser);
router.post(
  "/update-avatar",
  parser.single("avatar"),
  userController.UpdateAvatar
);
router.post(
  "/verify",
  parser.single("driverlincenseimg"),
  userController.VerifyUser
);
router.get("/rentalhistory", userController.GetRentalHistory);
router.get("/ownedvehicle", userController.GetOwnedVehicles);
module.exports = router;
