const express = require("express");
const router = express.Router();

const cartsController = require("../controllers/cart");
const authenticate = require("../../../middlewares/authMiddleware");


// Cart
router.post("/carts", authenticate("authenticated"), cartsController.create);
router.post(
  "/addToCarts",
  authenticate("authenticated"),
  cartsController.addToCart
);
router.get("/users/:userId/cartVariants", cartsController.findOne);
router.delete(
  "/cartVariants",
  authenticate("authenticated"),
  cartsController.emptyCart
);



module.exports = router;
