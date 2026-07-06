import { Router } from "express";
const router = Router();

router.get("/health", (req, res) => {
  try {
    res.status(200).json("HEALTH OK");
  } catch (err) {
    console.error(err);
  }
});

export default router;
