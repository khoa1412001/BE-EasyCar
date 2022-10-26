const express = require("express");
const router = express.Router();
const role = require("../configs/roleList");
const userController = require("../controllers/UserController");
const passport = require("../middlewares/verifyJWT"),
  verifyRoles = require("../middlewares/verifyRoles");

router.post("/register", userController.Register);
/**
 * @swagger
 * /api/auth/login:
 *    post:
 *     tags:
 *      - Auth
 *     summary: Login
 *     produces:
 *       - application/json
 *     responses:
 *      '200':
 *        description: OK
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                required: true
 *              password:
 *                type: string
 *                required: true
 *
 */
router.post("/login", userController.Login);
/**
 * @swagger
 * /api/auth/:
 *    get:
 *     tags:
 *      - Auth
 *     summary: getUserData
 *     produces:
 *       - application/json
 *     responses:
 *      '200':
 *        description: OK
 */
router.get(
  "/",
  passport,
  //verifyRoles(role.STAFF, role.ADMIN, role.CUSTOMER),
  userController.getUserData
);

router.get("/email", userController.checkEmail); //Kiem tra email
router.post("/change-password", passport, userController.changePassword); //Doi mat khau

module.exports = router;
