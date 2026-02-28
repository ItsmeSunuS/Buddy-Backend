const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

// All admin routes protected
router.use(protect, authorizeRoles("admin"));

// USERS
router.get("/users", adminController.getAllUsers);
router.put("/users/:id/role", adminController.updateUserRole);
router.delete("/users/:id", adminController.deleteUser);

// ANALYTICS
router.get("/analytics/signup", adminController.getSignupAnalytics);
router.get("/analytics/engagement", adminController.getEngagementAnalytics);
router.get("/activity-logs", adminController.getActivityLogs);

// GROUPS
router.get("/groups", adminController.getAllGroups);
router.delete("/groups/:id", adminController.deleteGroup);

// CHALLENGES
router.get("/challenges", adminController.getAllChallenges);
router.delete("/challenges/:id", adminController.deleteChallenge);

// GYMS
router.post("/gyms/create", adminController.createGym);
router.get("/gyms", adminController.getAllGyms);
router.delete("/gyms/:id", adminController.deleteGym);

//GetAdminDashboard

router.get("/dashboard-summary", adminController.getAdminDashboardSummary);

module.exports = router;