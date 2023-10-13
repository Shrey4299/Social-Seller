const express = require("express");
const router = express.Router();

const phonepePayment = require("./controllers/phonepeController");


const authenticate = require("./middlewares/authMiddleware");



// phonepe routes
router.post("/phonepePayment", phonepePayment.makePhonepePayment);
router.get("/phonepePaymentfailed", (req, res) => {
  const error = JSON.stringify(req.query.cURLError);
  res.send(`Payment Failed. Error: ${error}`);
});
router.get("/phonepe", phonepePayment.renderPhonepePage);
router.get("/phonepeSuccess", phonepePayment.renderPhonepeSuccess);
router.post("/phonepeVerify", phonepePayment.verifyPhonepePayment);


module.exports = router;
