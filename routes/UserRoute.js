const router = require("express").Router();
const userController = require("../controllers/UserController");
const passport = require("../middlewares/VerifyJWT");
const uploadImage = require("../middlewares/UploadImage");
router.post("/update", passport, userController.UpdateUser);
router.post(
  "/update-avatar",
  passport,
  uploadImage.single("avatar"),
  userController.UpdateAvatar
);
router.post(
  "/verify",
  passport,
  uploadImage.single("driverlincenseimg"),
  userController.VerifyUser
);
module.exports = router;
