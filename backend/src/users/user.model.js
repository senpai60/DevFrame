import mongoose from "mongoose";
import { type } from "os";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    bio: { type: String },
    skills: { type: [String], default: [] },
    githubUsername: { type: String, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    refreshToken: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
