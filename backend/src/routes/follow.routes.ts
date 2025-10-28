import { Router } from "express";
import { FollowController } from "../controllers/FollowController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.post(
  "/:clubId",
  authRequired,
  requireRole("user", "club-leader", "super-admin"),
  FollowController.followClub
);

router.delete(
  "/:clubId",
  authRequired,
  requireRole("user", "club-leader", "super-admin"),
  FollowController.unfollowClub
);

export default router;
