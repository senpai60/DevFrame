import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    githubRepoId: { type: Number, required: true },
    name: { type: String, required: true },
    fullName: { type: String },
    description: { type: String, default: "" },
    url: { type: String },
    language: { type: String, default: "" },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    isSynced: { type: Boolean, default: false },
    codeFileName: { type: String, default: "" },
    codeSnippet: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness per user-repo combination
repositorySchema.index({ userId: 1, githubRepoId: 1 }, { unique: true });

const Repository = mongoose.model("Repository", repositorySchema);
export default Repository;
