import { Router } from "express";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./users/user.routes.js";
import repositoryRoutes from "./repositories/repository.routes.js";
import projectRoutes from "./projects/project.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/repositories", repositoryRoutes);
router.use("/projects", projectRoutes);

router.get("/health", (req, res) => {
  try {
    res.status(200).json("HEALTH OK");
  } catch (err) {
    console.error(err);
  }
});

export default router;
