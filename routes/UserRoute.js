const router = require("express").Router();
const userController = require("../controllers/UserController");
const passport = require("../middlewares/verifyJWT");
router.post("/update", passport, userController.update);

module.exports = router;
