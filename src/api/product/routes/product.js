const express = require("express");
const router = express.Router();
const productsController = require("../controllers/product");
const searchController = require("../../../services/searchController");
const reviewsController = require("../../review/controllers/review")
const authenticate = require("../../../middlewares/authMiddleware");



// Product Routes
router.get("/products", productsController.findAll);
router.get("/products/:id", productsController.findOne);
router.post(
  "/categories/:id/products",
  authenticate("authenticated"),
  productsController.create
);
router.put(
  "/products/:id",
  authenticate("authenticated"),
  productsController.update
);
router.delete(
  "/products/:id",
  authenticate("admin"),
  productsController.remove
);
router.get(
  "/categories/:category_id/products",
  productsController.findProductByCategory
);
router.post(
  "/products/:id/reviews",
  authenticate("authenticated"),
  reviewsController.createReview
);

router.get("/search", searchController.searchProducts);




module.exports = router;
