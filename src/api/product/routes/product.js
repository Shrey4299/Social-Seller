const express = require("express");
const router = express.Router();
const productsController = require("../controllers/product");
const validateProduct = require("../middlewares/product"); // Import the validations
const authenticate = require("../../../middlewares/authMiddleware");
const searchController = require("../../../services/searchController");

// Product Routes
router.get("/products", productsController.findAll);
router.get("/products/:id", productsController.findOne);

// Use the create product validation middleware before the create route
router.post(
  "/categories/:id/products",
  authenticate("authenticated"),
  validateProduct.validateCreateProduct, // <-- Validation middleware here
  productsController.create
);

// Use the update product validation middleware before the update route
router.put(
  "/products/:id",
  authenticate("authenticated"),
  validateProduct.validateUpdateProduct, // <-- Validation middleware here
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

router.get("/search", searchController.searchProducts);

module.exports = router;
