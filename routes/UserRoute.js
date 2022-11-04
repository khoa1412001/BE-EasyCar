const router = require("express").Router();
const userController = require("../controllers/UserController");
const passport = require("../middlewares/VerifyJWT");
const parser = require("../middlewares/Parser");

router.post("/update", passport, userController.UpdateUser);
router.post(
  "/update-avatar",
  passport,
  parser.array("avatar"),
  userController.UpdateAvatar
);
router.post(
  "/verify",
  passport,
  parser.single("driverlincenseimg"),
  userController.VerifyUser
);
module.exports = router;
