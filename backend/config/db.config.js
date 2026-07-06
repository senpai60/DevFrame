import mongoose from "mongoose";
import { ENV_CONFIG } from "./env.config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV_CONFIG.MONGODB_URI);
    console.log("MONGODB CONNECTED SUCCESSFULLY 🥬🥬");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
