const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const tutorialController = require("./controllers/tutorialController");
const productController = require("./controllers/productController");
const orderController = require("./controllers/orderController");
const addressController = require("./controllers/addressController");
const roleController = require("./controllers/roleController");
const authenticate = require("./middlewares/authMiddleware");
const authController = require("./controllers/authController");

router.get("/tutorial", tutorialController.findAll);
router.get("/tutorial/:id", tutorialController.findOne);
router.post(
  "/tutorial",
  authenticate("authenticated"),
  tutorialController.create
);
router.put(
  "/tutorial/:id",
  authenticate("authenticated"),
  tutorialController.update
);
router.delete(
  "/tutorial/:id",
  authenticate("admin"),
  tutorialController.delete
);

router.post("/user", userController.create);
router.get("/user", userController.findAll);
router.get("/user/:id", userController.findOne);
router.put("/user/:id", authenticate("authenticated"), userController.update);
router.delete("/user/:id", authenticate("admin"), userController.delete);

router.get("/product", productController.findAll);
router.get("/product/:id", productController.findOne);
router.post(
  "/product",
  authenticate("authenticated"),
  productController.create
);
router.put(
  "/product/:id",
  authenticate("authenticated"),
  productController.update
);
router.delete("/product/:id", authenticate("admin"), productController.delete);

router.get("/order", orderController.findAll);
router.post("/order", authenticate("authenticated"), orderController.create);

router.post("/address", addressController.create);

router.post("/roles", roleController.create);

router.post("/login", authController.login);

module.exports = router;
