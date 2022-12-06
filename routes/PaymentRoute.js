const router = require("express").Router();
const paymentController = require("../controllers/PaymentController");
router.get("/list", paymentController.GetWithdrawList);
router.post("/new-withdraw", paymentController.AddWithdrawRequest);

module.exports = router;
