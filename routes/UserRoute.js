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
module.exports = router;
