const express = require("express");
const router = express.Router();
const paymentsController = require("./controllers/paymentController");
const checkPaymentMiddleware = require("./middlewares/checkPayment");
const checkPaymentLog = require("./middlewares/checkPaymentLog");

const authenticate = require("./middlewares/authMiddleware");



// Payment Routes
router.get("/razorpay", paymentsController.renderProductPage);
router.get("/", paymentsController.renderPaymentGateway);
router.post(
  "/createOrder",
  // checkPaymentMiddleware,
  paymentsController.createOrder
);
router.post("/verifyPayment", paymentsController.verifyPayment);
router.post(
  "/verification",
  checkPaymentLog,
  paymentsController.verifyPaymentWebhook
);



module.exports = router;
