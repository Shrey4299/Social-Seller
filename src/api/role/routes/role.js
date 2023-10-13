const express = require("express");
const router = express.Router();

const rolesController = require("../controllers/role");


router.post("/users/:id/roles", rolesController.create);

module.exports = router;
