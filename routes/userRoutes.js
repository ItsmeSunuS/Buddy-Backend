const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  updateProfile,
  getAllUsers,
  findMatches,
  addBuddy,
  getMyBuddies
} = require("../controllers/userController");
router.post("/add-buddy/:id", protect, addBuddy);
router.get("/matches", protect, findMatches);
router.put("/profile", protect, updateProfile);
router.get("/my-buddies", protect, getMyBuddies)
router.get("/all", protect, authorizeRoles("admin"), getAllUsers);

module.exports = router;