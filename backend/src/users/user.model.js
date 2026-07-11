import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    bio: { type: String },
    headline: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    skills: { type: [String], default: [] },
    socialLinks: {
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
      facebook: { type: String, default: "" }
    },
    githubUsername: { type: String, required: true },
    githubAccessToken: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    refreshToken: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
