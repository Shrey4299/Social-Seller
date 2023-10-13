const express = require("express");
const router = express.Router();
const usersController = require("../controllers/user");
const authController = require("../../../services/authController");

const authenticate = require("../../../middlewares/authMiddleware");

// User Routes
router.post("/users",  usersController.create);
router.get("/users", usersController.findAll);
router.get("/users/:id", usersController.findOne);
router.put("/users/:id", authenticate("authenticated"), usersController.update);
router.post("/login", authController.login);

module.exports = router;
