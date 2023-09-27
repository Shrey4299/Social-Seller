const express = require("express");
const router = express.Router();
const usersController = require("./controllers/userController");
const productsController = require("./controllers/productController");
const ordersController = require("./controllers/orderController");
const addressesController = require("./controllers/addressController");
const rolesController = require("./controllers/roleController");
const authController = require("./controllers/authController");
const paymentsController = require("./controllers/paymentController");
const categoriesController = require("./controllers/categoryController");
const discountsController = require("./controllers/discountController");
const variantsController = require("./controllers/variantController");
const reviewsController = require("./controllers/reviewController");
const cartsController = require("./controllers/cartController");
const searchController = require("./controllers/searchController");
const checkPaymentMiddleware = require("./middlewares/checkPayment");
const checkVariantQuantity = require("./middlewares/checkVariantQuantity ");
const validateUserCreate = require("./middlewares/validateUserCreate");
const checkVariantMiddleware = require("./middlewares/checkVariantMiddleware");

const authenticate = require("./middlewares/authMiddleware");

// User Routes
router.post("/users", validateUserCreate, usersController.create);
router.get("/users", usersController.findAll);
router.get("/users/:id", usersController.findOne);
router.put("/users/:id", authenticate("authenticated"), usersController.update);
router.delete("/users/:id", authenticate("admin"), usersController.delete);
router.post("/users/:id/roles", rolesController.create);
router.post("/login", authController.login);
router.post("/users/:id/address", addressesController.create);

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

// Categories
router.get("/categories", categoriesController.findAll);
router.post(
  "/categories",
  authenticate("authenticated"),
  categoriesController.create
);

// Variants
router.post(
  "/products/:id/variants/",
  authenticate("authenticated"),
  checkVariantMiddleware,
  variantsController.upload,
  variantsController.create
);

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

// Payment Routes
router.get("/", paymentsController.renderProductPage);
router.post(
  "/createOrder",
  checkPaymentMiddleware,
  paymentsController.createOrder
);
router.post("/verifyPayment", paymentsController.verifyPayment);
router.post("/verification", paymentsController.verifyPaymentWebhook);

router.get("/search", searchController.searchProducts);

module.exports = router;
