const express = require("express");
const router = express.Router();
const roleMiddleware = require("../middleware/rbcaMiddleware");
const auth = require("../controllers/authController");

// Home Route
router.get("/", (req, res) => {
  res.sendFile("./index.html", { root: __dirname });
});

// Get all users based on the role
router.get("/allUsers", roleMiddleware.filterUsersByRole());

//search endpoint for the admin users to search for users by name or email or role
// Search Endpoint for Admins
router.get("/search", roleMiddleware.searchUser);

// Student Dashboard Route
router.get(
  "/dashboard/student",
  roleMiddleware.studentDashboard, // Use the generic role check middleware
  (req, res) => {
    res.json({ message: "You are Authorised to access this endpoint" });
  }
);

// Tutor Dashboard Route
router.get(
  "/dashboard/tutor",
  roleMiddleware.tutorDashboard, // Use the generic role check middleware
  (req, res) => {
    res.json({ message: "You are Authorised to access this endpoint" });
  }
);

// Admin Dashboard Route
router.get(
  "/dashboard/admin",
  roleMiddleware.adminDashboard, // Use the generic role check middleware
  (req, res) => {
    res.json({ message: "You are Authorised to access this endpoint" });
  }
);

// Register Route
router.post("/register", auth.register);

// Login Route
router.post("/login", auth.login);

//update user
// Update Profile Route
router.put("/profile", auth.updateProfile);

module.exports = router;
