const jwt = require("jsonwebtoken");
const Permissions = require("../models/permissions");
const User = require("../models/user");
// Middleware factory to check if the user has a specific role
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Check if the Authorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({
          message: "Authorization header missing. User is not logged in.",
        });
      }

      // Get the token from the Authorization header
      const token = req.headers.authorization.split(" ")[1];

      // Verify the token using the JWT secret
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "RANDOM-TOKEN"
      );

      // Check if the user has the required role
      if (decodedToken.role !== requiredRole) {
        return res.status(403).json({
          message: `Access denied: ${requiredRole}s only. Your role: ${decodedToken.role}`,
        });
      }

      // Pass the user object to the request object for further use
      req.user = decodedToken;
      next(); // Proceed to the next middleware or endpoint
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};

exports.checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user ? req.user.role : "anonymous";
    const userPermissions = new Permissions().getPermissionsByRoleName(
      userRole
    );

    // Check if the user has the required permission
    if (userPermissions && userPermissions.includes(permission)) {
      req.userPermissions = userPermissions; // Attach permissions to the request object
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
  };
};

//Accessing student data
//if tutor: List of students no ability to edit or delete or add students data
//if student: Only their own data
//if admin: All students data with ability to edit, delete or add students data

exports.filterUsersByRole = () => {
  return async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({
          message: "Authorization header missing. User is not logged in.",
        });
      }

      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "RANDOM-TOKEN"
      );

      const userData = await User.findById(decodedToken.id);

      if (!userData) {
        return res.status(404).json({ message: "User data not found" });
      }

      if (decodedToken.role === "admin") {
        const allUsers = await User.find({});
        return res.json({
          students: allUsers.filter((user) => user.role === "student"),
          tutors: allUsers.filter((user) => user.role === "tutor"),
          admins: allUsers.filter((user) => user.role === "admin"),
          permissions: new Permissions().getPermissionsByRoleName("admin"),
        });
      } else if (decodedToken.role === "tutor") {
        return res.json({
          userData: userData,
          permissions: new Permissions().getPermissionsByRoleName("tutor"),
        });
        // TODO: In the future, allow tutors to see the list of students attending their courses.
      } else if (decodedToken.role === "student") {
        return res.json({
          userData: userData,
          permissions: new Permissions().getPermissionsByRoleName("student"),
        });
      }

      return res.status(403).json({ message: "Access denied" });
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};

// Exporting specific role-checking middleware
exports.studentDashboard = checkRole("student");
exports.tutorDashboard = checkRole("tutor");
exports.adminDashboard = checkRole("admin");
