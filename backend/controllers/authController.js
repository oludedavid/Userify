const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Role = require("../models/role");
const Permissions = require("../models/permissions");

// Create an instance of the Role class
const roleManager = new Role();
//permission manager
const permissionManager = new Permissions();
//register a user to the database
exports.register = async (req, res) => {
  try {
    // Get the payload from the request body
    const { email, password, role } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if the user role exists or is valid
    if (!roleManager.checkRoleExists(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ email, password: hashPassword, role });

    // Save the user
    await user.save();

    // Return a success message
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

//login a user
exports.login = async (req, res) => {
  try {
    //get the payload data
    const { email, password } = req.body;

    //find the user in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: "Email not found" });
    }

    //compare the password entered by the user with that of the found user that matches the email using bcrypt
    const passwordCheck = await bcrypt
      .compare(password, user.password)
      .catch((err) => {
        res.status(400).send({
          message: "Password do not match",
          err,
        });
      });
    if (!passwordCheck) {
      return res.status(400).send({
        message: "Password do not match",
      });
    }

    // get user role
    const userRole = user?.role || "no role found";

    //get user permissions
    const userPermissions =
      permissionManager.getPermissionsByRoleName(userRole);

    //create session management using jwt
    let token = jwt.sign(
      {
        email: user.email,
        role: userRole,
        id: user._id,
        permissions: userPermissions,
      },
      process.env.JWT_SECRET || "RANDOM-TOKEN",
      { expiresIn: "24h", algorithm: "HS256" }
    );

    return res.status(200).send({
      message: "Login Successful",
      email: user.email,
      token,
    });
  } catch (jwtError) {
    console.log(jwtError);
    return res
      .status(500)
      .send({ message: "Internal server error during token creation." });
  }
};
