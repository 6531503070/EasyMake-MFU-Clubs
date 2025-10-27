import { Router } from "express";
import { ClubController } from "../controllers/ClubController";
import { AdminController } from "../controllers/AdminController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// club-leader creates club
router.post(
  "/",
  authRequired,
  requireRole("club-leader"),
  ClubController.createClub
);

// public info
router.get("/:clubId", ClubController.getClubPublic);

// approve & suspend (super-admin only)
router.patch(
  "/:clubId/approve",
  authRequired,
  requireRole("super-admin"),
  AdminController.approveClub
);

router.patch(
  "/:clubId/suspend",
  authRequired,
  requireRole("super-admin"),
  AdminController.suspendClub
);

export default router;
