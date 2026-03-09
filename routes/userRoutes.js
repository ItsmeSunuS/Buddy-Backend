const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  updateProfile,
  getAllUsers,
  addBuddy,
  getMyBuddies,
  removeBuddy,
  getSuggestedBuddies
} = require("../controllers/userController");
router.post("/add-buddy/:id", protect, addBuddy);
router.get("/matches", protect, getSuggestedBuddies);
router.put("/profile", protect, updateProfile);
router.delete("/buddies/:id", protect, removeBuddy);
router.get("/my-buddies", protect, getMyBuddies);
router.get("/all", protect, authorizeRoles("admin"), getAllUsers);

module.exports = router;