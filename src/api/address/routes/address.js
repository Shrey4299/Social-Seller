const express = require("express");
const router = express.Router();

const addressesController = require("../controllers/address");

// User Routes

router.post("/users/:id/address", addressesController.create);

module.exports = router;
