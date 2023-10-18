const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/paymentLog");
const checkPaymentRequest = require("../middlewares/checkpaymentRequest");
const checkWebhookPaymentLog = require("../middlewares/checkWebhookPaymentLog");

const authenticate = require("../../../middlewares/authMiddleware");

// Payment Routes
router.get("/razorpay", paymentsController.renderProductPage);
router.get("/", paymentsController.renderPaymentGateway);
router.post(
  "/createOrder",
  checkPaymentRequest,
  paymentsController.createOrder
);

router.post(
  "/verifyPayment",
  authenticate("authenticated"),
  paymentsController.verifyPayment
);
router.post(
  "/verification",
  checkWebhookPaymentLog,
  paymentsController.verifyPaymentWebhook
);

module.exports = router;
