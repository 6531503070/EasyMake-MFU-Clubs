import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get(
  "/",
  authRequired,
  requireRole("user", "club-leader", "super-admin"),
  NotificationController.listMyNotifications
);

router.patch(
  "/:id/read",
  authRequired,
  requireRole("user", "club-leader", "super-admin"),
  NotificationController.markAsRead
);

export default router;
