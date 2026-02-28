const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { requireCompleteProfile } = require("../middleware/profileMiddleware");

const {
  createGroup,
  joinGroup,
  updateGroupProgress,
  getGroup
} = require("../controllers/groupController");


router.post("/create", protect, requireCompleteProfile, createGroup);
router.post("/join/:id", protect, requireCompleteProfile, joinGroup);
router.put("/update/:id", protect, requireCompleteProfile, updateGroupProgress);
router.get("/:id", protect, requireCompleteProfile, getGroup);

module.exports = router;