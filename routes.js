const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const productController = require("./controllers/productController");
const orderController = require("./controllers/orderController");
const addressController = require("./controllers/addressController");
const roleController = require("./controllers/roleController");
const authController = require("./controllers/authController");
const paymentController = require("./controllers/paymentController");
const categoryController = require("./controllers/categoryController");
const discountController = require("./controllers/discountController");
const variantController = require("./controllers/variantController");
const reviewController = require("./controllers/reviewController");
const cartController = require("./controllers/cartController");
const searchController = require("./controllers/searchController");
const checkPaymentMiddleware = require("./middlewares/checkPayment");

const authenticate = require("./middlewares/authMiddleware");

// User Routes
router.post("/user", userController.create);
router.get("/user", userController.findAll);
router.get("/user/:id", userController.findOne);
router.put("/user/:id", authenticate("authenticated"), userController.update);
router.delete("/user/:id", authenticate("admin"), userController.delete);
router.post("/roles/user/:id", roleController.create);
router.post("/login", authController.login);
router.post("/address/user/:id", addressController.create);

// Product Routes
router.get("/product", productController.findAll);
router.get("/product/:id", productController.findOne);
router.post(
  "/product/category/:id",
  authenticate("authenticated"),
  productController.create
);
router.put(
  "/product/:id",
  authenticate("authenticated"),
  productController.update
);
router.delete("/product/:id", authenticate("admin"), productController.remove);
router.get(
  "/products/category/:category_id",
  productController.findProductByCategory
);
router.post(
  "/reviews/product/:id",
  authenticate("authenticated"),
  reviewController.createReview
);

// categories
router.get("/categories", categoryController.findAll);
router.post(
  "/category",
  authenticate("authenticated"),
  categoryController.create
);

// variants
router.post(
  "/variant/product/:id",
  authenticate("authenticated"),
  variantController.upload,
  variantController.create
);

// cart
router.post("/cart", authenticate("authenticated"), cartController.create);
router.post(
  "/addToCart/",
  authenticate("authenticated"),
  cartController.addToCart
);
router.get("/cartvariants/user/:userId", cartController.findOne);
router.delete(
  "/cartvariants/",
  authenticate("authenticated"),
  cartController.emptyCart
);

// Order Routes
router.get("/order", orderController.findAll);
router.post("/order", authenticate("authenticated"), orderController.create);
router.post(
  "/discount",
  authenticate("authenticated"),
  discountController.create
);

router.post(
  "/ordervariants",
  authenticate("authenticated"),
  orderController.createVariantOrder
);

// Payment Routes
router.get("/", paymentController.renderProductPage);
router.post(
  "/createOrder",
  checkPaymentMiddleware,
  paymentController.createOrder
);
router.post("/verifyPayment", paymentController.verifyPayment);

router.get("/search", searchController.searchProducts);

module.exports = router;
