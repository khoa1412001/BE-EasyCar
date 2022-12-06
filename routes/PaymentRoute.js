const router = require("express").Router();
const paymentController = require("../controllers/PaymentController");
const passport = require("../middlewares/VerifyJWT");

router.get("/list", passport,paymentController.GetWithdrawList);
router.post("/new-withdraw", passport,paymentController.AddWithdrawRequest);
router.post('/create-payment', passport,paymentController.createPayment);
router.post('/result-payment', paymentController.ipn);

module.exports = router;
