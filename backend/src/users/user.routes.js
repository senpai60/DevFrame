import { Router } from "express";
import * as userController from "./user.controller.js";
import { protect } from "../auth/auth.middleware.js";
import { validateProfileUpdate, validateAvatarUpdate } from "./user.validation.js";

const router = Router();

// GET /api/v1/users/profile -> Get current user's profile
router.get("/profile", protect, userController.getProfile);

// PATCH /api/v1/users/profile -> Update current user's profile
router.patch("/profile", protect, validateProfileUpdate, userController.updateProfile);

// PATCH /api/v1/users/avatar -> Update current user's avatar url
router.patch("/avatar", protect, validateAvatarUpdate, userController.updateAvatar);

// GET /api/v1/users/:username -> Get a user's public profile by username
router.get("/:username", userController.getPublicProfile);

export default router;
