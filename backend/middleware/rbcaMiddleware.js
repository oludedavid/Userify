const jwt = require("jsonwebtoken");
const Permissions = require("../models/permissions");

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

// Exporting specific role-checking middleware
exports.studentDashboard = checkRole("student");
exports.tutorDashboard = checkRole("tutor");
exports.adminDashboard = checkRole("admin");
