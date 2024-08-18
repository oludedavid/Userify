const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const Permissions = require("../models/permissions");

// Middleware to check if the user is a student
exports.studentDashboard = () => {
  return (req, res, next) => {
    try {
      // Step 1: Check if the Authorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({
          message: "Authorization header missing. User is not logged in.",
        });
      }

      // Step 2: Get the token from the Authorization header
      const token = req.headers.authorization.split(" ")[1];

      // Step 3: Verify the token using the JWT secret
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "RANDOM-TOKEN"
      );

      // Step 4: Retrieve the user details from the decoded token
      const user = decodedToken;

      // Step 5: Check if the user is a student
      if (user.role !== "student") {
        return res.status(403).json({
          message: "Access denied: Students only. Your role: " + user.role,
        });
      }

      // Step 6: Pass the user object to the request object for further use
      req.user = user;
      next(); // Proceed to the next middleware or endpoint
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};

// Middleware to check if the user is a tutor
exports.tutorDashboard = () => {
  return (req, res, next) => {
    try {
      // Step 1: Check if the Authorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({
          message: "Authorization header missing. User is not logged in.",
        });
      }

      // Step 2: Get the token from the Authorization header
      const token = req.headers.authorization.split(" ")[1];

      // Step 3: Verify the token using the JWT secret
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "RANDOM-TOKEN"
      );

      // Step 4: Retrieve the user details from the decoded token
      const user = decodedToken;

      // Step 5: Check if the user is a student
      if (user.role !== "tutor") {
        return res.status(403).json({
          message: "Access denied: Tutors only. Your role: " + user.role,
        });
      }

      // Step 6: Pass the user object to the request object for further use
      req.user = user;
      next(); // Proceed to the next middleware or endpoint
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }
  };
};

// Middleware to check if the user is a admin
exports.adminDashboard = () => {
  return (req, res, next) => {
    try {
      // Step 1: Check if the Authorization header is present
      if (!req.headers.authorization) {
        return res.status(401).json({
          message: "Authorization header missing. User is not logged in.",
        });
      }

      // Step 2: Get the token from the Authorization header
      const token = req.headers.authorization.split(" ")[1];

      // Step 3: Verify the token using the JWT secret
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || "RANDOM-TOKEN"
      );

      // Step 4: Retrieve the user details from the decoded token
      const user = decodedToken;

      // Step 5: Check if the user is a student
      if (user.role !== "admin") {
        return res.status(403).json({
          message: "Access denied: Admins only. Your role: " + user.role,
        });
      }

      // Step 6: Pass the user object to the request object for further use
      req.user = user;
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

    if (userPermissions) {
      return userPermissions;
      next();
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
  };
};
