import { connectDB } from "./config/db.config.js";
import { findOrCreateGithubUser } from "./src/auth/auth.service.js";
import mongoose from "mongoose";

async function runTest() {
  await connectDB();

  const mockProfile = {
    username: "testoctocat",
    displayName: "The Octocat",
    emails: [{ value: "octocat@github.com" }],
    photos: [{ value: "https://avatars.githubusercontent.com/u/583231?v=4" }],
  };

  try {
    console.log(
      "Attempting to find or create user with mock GitHub profile...",
    );
    const user = await findOrCreateGithubUser(mockProfile);
    console.log("User successfully processed:", user);
    console.log("SUCCESS!");
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    mongoose.connection.close();
  }
}

runTest();
