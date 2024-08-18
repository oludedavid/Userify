const mongoose = require("mongoose");

// create the mongoose backend model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "tutor", "admin"],
    default: "student",
    required: [true, "Please provide a role!"],
    unique: false,
  },
});

// Create user model or register user schema to mongoose
const User = mongoose.model("User", userSchema);

// Export user model
module.exports = User;
