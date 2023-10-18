const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/category");
const authenticate = require("../../../middlewares/authMiddleware");
const categoryValidation = require("../middlewares/category"); // Import the category validation middleware

// Categories
router.get("/categories", categoriesController.findAll);

// Apply the middleware for category creation
router.post(
  "/categories",
  authenticate("authenticated"),
  categoryValidation.createCategoryValidation,
  categoriesController.create
);

module.exports = router;
