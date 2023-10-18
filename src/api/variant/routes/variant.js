const express = require("express");
const router = express.Router();
const variantsController = require("../controllers/variant");
const checkVariantMiddleware = require("../middlewares/variant");
const authenticate = require("../../../middlewares/authMiddleware");

// Variants
router.post(
  "/products/:id/variants/",
  authenticate("authenticated"),
  // checkVariantMiddleware,
  variantsController.upload,
  variantsController.create
);

module.exports = router;
