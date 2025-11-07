import { Router } from "express";
import { ActivityController } from "../controllers/ActivityController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { requireClubStaff } from "../middleware/clubRoleGuard";
import { upload } from "../middleware/upload";

const router = Router();

// create activity + images (multipart/form-data, field: "images")
router.post(
  "/clubs/:clubId/activities",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  upload.array("images", 10),
  ActivityController.createActivity
);

// update activity status
router.patch(
  "/activities/:id/status",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  ActivityController.updateStatus
);

// (optional) update details + append images
router.patch(
  "/activities/:id/details",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  upload.array("images", 10),
  ActivityController.updateDetails
);

// register to activity
router.post(
  "/activities/:id/register",
  authRequired,
  requireRole("user", "club-leader", "co-leader", "super-admin"),
  ActivityController.registerToActivity
);

router.post(
  "/activities/:id/unregister",
  authRequired,
  requireRole("user", "club-leader", "co-leader", "super-admin"),
  ActivityController.unregisterFromActivity
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
