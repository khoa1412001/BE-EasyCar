const express = require("express");
const router = express.Router();
const role = require("../configs/roleList");
const authController = require("../controllers/AuthController");
const passport = require("../middlewares/VerifyJWT"),
  verifyRoles = require("../middlewares/VerifyRoles");
/**
 * @swagger
 * /api/auth/register:
 *    post:
 *     tags:
 *      - Auth
 *     summary: Register
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
 *              email:
 *                type: string
 *                required: true
 *              socialId:
 *                type: string
 *                required: true
 *              phoneNumber:
 *                type: string
 *                required: true
 */
router.post("/register", authController.Register);
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
router.post("/login", authController.Login);
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
  authController.getUserData
);
// router.get('/refresh', authController.refreshToken)

router.post("/check-email", authController.checkEmail); //Kiem tra email
router.post("/change-password", passport, authController.changePassword); //Doi mat khau
router.get("/validate-mail/:token", authController.validateMail);
router.post("/google", authController.loginWithGoogle);
module.exports = router;
