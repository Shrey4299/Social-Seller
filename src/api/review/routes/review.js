const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/review");
const { createReviewValidation } = require("../middlewares/review");
const authenticate = require("../../../middlewares/authMiddleware");

router.post(
  "/products/:id/reviews",
  authenticate("authenticated"),
  createReviewValidation,
  reviewsController.createReview
);

module.exports = router;
