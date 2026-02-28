const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { requireCompleteProfile } = require("../middleware/profileMiddleware");

const {
  createChallenge,
  joinChallenge,
  updateProgress,
  getChallenge,
  getAllChallenges
  
} = require("../controllers/challengeController");

router.post("/create", protect, requireCompleteProfile, createChallenge);
router.post("/join/:id", protect, requireCompleteProfile, joinChallenge);
router.put("/update/:id", protect, requireCompleteProfile, updateProgress);
//  Fetch single challenge
router.get("/:id", protect, requireCompleteProfile, getChallenge);
router.get("/", protect, requireCompleteProfile, getAllChallenges);

module.exports = router;