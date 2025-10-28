import { Router } from "express";
import { ActivityController } from "../controllers/ActivityController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { requireClubStaff } from "../middleware/clubRoleGuard";

const router = Router();

// create activity
router.post(
  "/clubs/:clubId/activities",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  ActivityController.createActivity
);

// update activity status
router.patch(
  "/activities/:id/status",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  ActivityController.updateStatus
);

// register to activity
router.post(
  "/activities/:id/register",
  authRequired,
  requireRole("user", "club-leader", "co-leader", "super-admin"),
  ActivityController.registerToActivity
);

// check-in user
router.post(
  "/activities/checkin/:regId",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  ActivityController.checkInUser
);

// manage single activity view
router.get(
  "/activities/:id/manage",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  ActivityController.getActivityManageView
);

export default router;
