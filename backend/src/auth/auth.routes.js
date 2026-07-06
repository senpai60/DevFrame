import { Router } from "express";
import passport from "passport";
import * as authController from "./auth.controller.js";
import { protect } from "./auth.middleware.js";

const router = Router();

// Initiate GitHub OAuth flow
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// GitHub OAuth callback
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  authController.githubCallback
);

// Get current user profile
router.get("/me", protect, authController.getCurrentUser);

// Refresh access token
router.post("/refresh", authController.refreshTokens);

// Logout
router.post("/logout", authController.logout);

export default router;
