const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { requireCompleteProfile } = require("../middleware/profileMiddleware");
const { addWorkout } = require("../controllers/workoutController");
const { getAllWorkouts } = require("../controllers/workoutController");


router.post("/add", protect, requireCompleteProfile, addWorkout);
router.get("/", protect, getAllWorkouts);
module.exports = router;