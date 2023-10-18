const express = require("express");
const router = express.Router();
const discountsController = require("../controllers/discount");
const authenticate = require("../../../middlewares/authMiddleware");
const discountValidation = require("../middlewares/discount"); // Import the discount validation middleware


router.post(
  "/discounts",
  authenticate("authenticated"),
  discountValidation.createDiscountValidation,
  discountsController.create
);

module.exports = router;
