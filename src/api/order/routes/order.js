const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/order");

const authenticate = require("../../../middlewares/authMiddleware");

// Order Routes
router.get("/orders", ordersController.findAll);
router.post("/orders", authenticate("authenticated"), ordersController.create);
router.post(
  "/discounts",
  authenticate("authenticated"),
  discountsController.create
);

router.post(
  "/orderVariants",
  authenticate("authenticated"),
  checkVariantQuantity,
  ordersController.createVariantOrder
);

module.exports = router;
