// controllers/reviewController.js

const db = require("../../../services");
const Review = db.reviews;

exports.createReview = async (req, res) => {
  try {
    const { description, rating } = req.body;
    const ProductId = req.params.id;
    const UserId = req.user.id;

    const review = await Review.create({
      description: description,
      rating: rating,
      UserId: UserId,
      ProductId: ProductId,
    });

    return res.status(201).send(review); 
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message:
        error.message || "Some error occurred while creating the review.",
    });
  }
};

