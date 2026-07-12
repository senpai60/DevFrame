import { Router } from "express";
import * as projectController from "./project.controller.js";
import { protect } from "../auth/auth.middleware.js";
import { validateProjectCreate, validateProjectUpdate } from "./project.validation.js";

const router = Router();

router.get("/feed", projectController.getFeed);
router.get("/repo/:repoId", protect, projectController.getProjectByRepo);
router.get("/:id", projectController.getProject);

router.post("/", protect, validateProjectCreate, projectController.createProject);
router.patch("/:id", protect, validateProjectUpdate, projectController.updateProject);
router.delete("/:id", protect, projectController.deleteProject);

// Like and Comments
router.patch("/:id/like", protect, projectController.likeProject);
router.post("/:id/comments", protect, projectController.addComment);

export default router;
