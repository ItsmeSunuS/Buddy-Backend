const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { requireCompleteProfile } = require("../middleware/profileMiddleware");
const { getDashboardSummary } = require("../controllers/dashboardController");

router.get("/summary", protect, requireCompleteProfile, getDashboardSummary);

module.exports = router;