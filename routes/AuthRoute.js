const express = require("express");
const router = express.Router();
const role = require("../configs/RoleList");
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

// router.get('/refresh', authController.refreshToken)

router.post("/check-email", authController.CheckEmail); //Kiem tra email
router.post("/change-password", passport, authController.ChangePassword); //Doi mat khau
router.get("/validate-mail/:token", authController.ValidateMail);
router.post("/google", authController.LoginWithGoogle);
router.post("/login-admin", authController.LoginAdmin);
module.exports = router;
