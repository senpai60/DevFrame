import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    repositoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Repository", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    images: { type: [String], required: true }, // base64 representation of screenshots
    demoUrl: { type: String, default: "" },
    repoUrl: { type: String, required: true },
    techStack: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    publishedAt: { type: Date, default: Date.now },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views: { type: Number, default: 0 },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String, required: true },
        avatar: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
