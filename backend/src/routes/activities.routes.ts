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
  requireRole("club-leader", "super-admin", "user"),
  requireClubStaff,
  ActivityController.createActivity
);

// update activity status
router.patch(
  "/activities/:id/status",
  authRequired,
  requireRole("club-leader", "super-admin", "user"),
  ActivityController.updateStatus
);

// join activity (any logged-in user)
router.post(
  "/activities/:id/register",
  authRequired,
  requireRole("user", "club-leader", "super-admin"),
  ActivityController.registerToActivity
);

// check-in user (staff/leader/admin)
router.post(
  "/activities/checkin/:regId",
  authRequired,
  requireRole("club-leader", "super-admin", "user"),
  ActivityController.checkInUser
);

export default router;
