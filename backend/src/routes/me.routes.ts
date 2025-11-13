import { Router } from "express";
import { MeController } from "../controllers/MeController";
import { authRequired } from "../middleware/auth";

const router = Router();

router.get("/me", authRequired, MeController.getMe);
router.get(
  "/me/following/clubs",
  authRequired,
  MeController.listFollowingClubs
);

export default router;
