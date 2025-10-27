import { Router } from "express";
import { ClubController } from "../controllers/ClubController";
import { AdminController } from "../controllers/AdminController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get(
  "/",
  authRequired,
  requireRole("super-admin"),
  AdminController.listAllClubs
);

router.post(
  "/",
  authRequired,
  requireRole("club-leader"),
  ClubController.createClub
);

router.get("/:clubId", ClubController.getClubPublic);

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

export default router;
