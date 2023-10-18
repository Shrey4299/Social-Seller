const express = require("express");
const router = express.Router();

const validateAddress = require("../middlewares/address");
const addressesController = require("../controllers/address");

// User Routes

router.post("/users/:id/address", validateAddress.createAddressValidation, addressesController.create);
router.put("/address/:id", validateAddress.updateAddressValidation, addressesController.update)
module.exports = router;
