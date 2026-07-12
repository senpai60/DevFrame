import { Router } from "express";
import * as repositoryController from "./repository.controller.js";
import { protect } from "../auth/auth.middleware.js";

const router = Router();

// Protect all repository endpoints
router.use(protect);

router.get("/", repositoryController.getRepositories);
router.get("/:id", repositoryController.getRepositoryById);
router.post("/sync", repositoryController.syncRepositories);
router.patch("/:id/sync-toggle", repositoryController.toggleSync);
router.patch("/:id/code", repositoryController.updateCodeShowcase);

export default router;
