import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxLength: [50, "Name is too long"],
    minLength: [3, "Name is too short"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: false,
    default: "user",
    enum: {
      values: ["user", "admin"],
      message: "Invalid role",
    },
  },
  createdAt: { type: Date, default: Date.now() },
});

export default mongoose.model("users", userSchema);
