const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user");
const authController = require("../../../services/authController");
const authPhoneController = require("../../../services/authPhoneController");
const validateUser = require("../middlewares/user");

const authenticate = require("../../../middlewares/authMiddleware");

// User Routes
router.post("/users", validateUser.validateUserCreate, usersController.create);
router.get("/users", usersController.findAll);
router.get("/user", authenticate("authenticated"), usersController.findOne);
router.put(
  "/users/:id",
  authenticate("authenticated"),
  validateUser.validateUserUpdate,
  usersController.update
);
router.post(
  "/users/:id/reset-password",
  authenticate("authenticated"),
  validateUser.validatePassword,
  usersController.resetPassword
);
router.post("/login", authController.login);
router.post("/phoneLogin", authPhoneController.phoneLogin);

module.exports = router;
