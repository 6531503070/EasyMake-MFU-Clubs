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

// (optional) update details + append images
router.patch(
  "/:id/details",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  upload.array("images", 10),
  ActivityController.updateDetails
);

// update activity status
router.patch(
  "/:id/status",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  ActivityController.updateStatus
);
// register to activity
router.post(
  "/:id/register",
  authRequired,
  requireRole("user", "club-leader", "co-leader", "super-admin"),
  ActivityController.registerToActivity
);

router.post(
  "/:id/unregister",
  authRequired,
  requireRole("user", "club-leader", "co-leader", "super-admin"),
  ActivityController.unregisterFromActivity
);

// check-in user
router.post(
  "/checkin/:regId",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  ActivityController.checkInUser
);

// manage single activity view
router.get(
  "/:id/manage",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  ActivityController.getActivityManageView
);

// list public activities by club
router.get(
  "/public/by-club/:clubId",
  ActivityController.listPublicByClub
);

router.get(
  "/my/registrations",
  authRequired,
  requireRole("user", "club-leader", "co-leader", "super-admin"),
  ActivityController.listMyRegistrations
)

// public feed every club
router.get(
  "/public/feed",
  ActivityController.listPublicFeed
);

export default router;
