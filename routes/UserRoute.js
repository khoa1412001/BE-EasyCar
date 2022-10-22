const express = require("express");
const router = express.Router();
const role = require("../configs/role_list");
const userController = require("../controllers/UserController");
const passport = require("../middlewares/verifyJWT"),
  verifyRoles = require("../middlewares/verifyRoles");
router.post("/register", userController.Register);
router.post("/login", userController.Login);
router.get(
  "/",
  passport,
  verifyRoles(role.STAFF, role.ADMIN),
  userController.getUserData
);
//, verifyRoles
module.exports = router;
