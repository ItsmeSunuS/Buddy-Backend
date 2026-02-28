const express = require("express");
const router = express.Router();
const gymController = require("../controllers/gymController");

// GET /api/gyms?city=Hyderabad
router.get("/", gymController.getGyms);

module.exports = router;