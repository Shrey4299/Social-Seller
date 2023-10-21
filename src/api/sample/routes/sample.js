const express = require("express");
const router = express.Router();
const sampleController = require("../controllers/sample");

router.get("/sample", sampleController.sendSampleMessage);

module.exports = router;
