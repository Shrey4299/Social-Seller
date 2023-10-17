const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/paymentLog");
const checkPaymentMiddleware = require("../middlewares/checkPayment");
const checkPaymentLog = require("../middlewares/checkPaymentLog");

const authenticate = require("../../../middlewares/authMiddleware");

// Payment Routes
router.get("/razorpay", paymentsController.renderProductPage);
router.get("/", paymentsController.renderPaymentGateway);
router.post(
  "/createOrder",
  // checkPaymentMiddleware,
  paymentsController.createOrder
);
router.post("/verifyPayment", authenticate, paymentsController.verifyPayment);
router.post(
  "/verification",
  authenticate,
  checkPaymentLog,
  paymentsController.verifyPaymentWebhook
);

module.exports = router;
