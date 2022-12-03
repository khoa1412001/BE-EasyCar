const router = require("express").Router();
const userController = require("../controllers/UserController");
const passport = require("../middlewares/VerifyJWT");
const parser = require("../middlewares/Parser");

router.get("/", passport, userController.GetUserData);
router.post("/update-info", userController.UpdateUserInfo);
router.post("/update-avatar", parser.single("avatar"), userController.UpdateAvatar);
router.post("/verify", parser.single("driverlincenseimg"), userController.VerifyUser);
router.post("/update-bank-info", userController.UpdateBankInfo);

module.exports = router;
