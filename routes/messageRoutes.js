const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getConversation
} = require("../controllers/messageController");

router.post("/send", protect, sendMessage);
router.get("/conversation/:id", protect, getConversation);

module.exports = router;