// controllers/reviewController.js

const db = require("../models");
const Review = db.reviews;

exports.createReview = async (req, res) => {
  try {
    const { description, rating } = req.body;
    const ProductId = req.params.id;
    const UserId = req.user.id;

    if (!description || !rating || !UserId || !ProductId) {
      return res.status(400).send({
        message: "All fields are required!",
      });
    }

    const review = await Review.create({
      description: description,
      rating: rating,
      UserId: UserId,
      ProductId: ProductId,
    });

    res.send(review);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the review.",
    });
  }
};

// Add similar functions for updating, deleting, and retrieving reviews.
