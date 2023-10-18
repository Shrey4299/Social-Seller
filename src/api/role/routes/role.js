const express = require("express");
const router = express.Router();

const rolesController = require("../controllers/role");
const { createRoleValidation } = require("../middlewares/role");

router.post("/users/:id/roles", createRoleValidation, rolesController.create);

module.exports = router;
