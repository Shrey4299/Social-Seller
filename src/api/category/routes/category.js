const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/category");
const authenticate = require("../../../middlewares/authMiddleware");

// Categories
router.get("/categories", categoriesController.findAll);
router.post(
  "/categories",
  authenticate("authenticated"),
  categoriesController.create
);

module.exports = router;
