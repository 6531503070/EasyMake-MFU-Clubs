import { Router } from "express";
import { ClubController } from "../controllers/ClubController";
import { AdminController } from "../controllers/AdminController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { requireClubStaff } from "../middleware/clubRoleGuard";
import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
});

// super-admin list all clubs
router.get(
  "/",
  authRequired,
  requireRole("super-admin"),
  AdminController.listAllClubs
);

// club-leader create new club
router.post(
  "/",
  authRequired,
  requireRole("club-leader", "super-admin"),
  ClubController.createClub
);

// public profile
router.get("/:clubId", ClubController.getClubPublic);

// update club profile (leader/co-leader)
router.patch(
  "/:clubId/profile-self",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  ClubController.updateClubProfileSelf
);

// list members/followers
router.get(
  "/:clubId/followers",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  ClubController.listMembers
);

// list posts (dashboard)
router.get(
  "/:clubId/posts/mine",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  ClubController.listPostsForClubStaff
);

// list activities (dashboard)
router.get(
  "/:clubId/activities/mine",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  ClubController.listActivities
);

// super admin operations
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

router.patch(
  "/:clubId/activate",
  authRequired,
  requireRole("super-admin"),
  AdminController.activateClub
);

router.patch(
  "/:clubId/update-with-leader",
  authRequired,
  requireRole("super-admin"),
  AdminController.updateClubWithLeader
);

router.delete(
  "/:clubId",
  authRequired,
  requireRole("super-admin"),
  AdminController.deleteClub
);

router.post(
  "/admin/create-club-with-leader",
  authRequired,
  requireRole("super-admin"),
  AdminController.createClubWithLeader
);
router.post(
  "/:clubId/cover-image",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  upload.single("file"),
  ClubController.updateClubCoverImage
);

router.patch(
  "/:clubId/cover-image",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  upload.single("file"),
  ClubController.updateClubCoverImage
);

// serve cover image
router.get("/:clubId/cover-image", ClubController.getClubCoverImage);

export default router;
