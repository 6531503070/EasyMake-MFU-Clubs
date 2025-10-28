import { Router } from "express";
import { ReportController } from "../controllers/ReportController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

// user submits report
router.post(
  "/",
  authRequired,
  requireRole("user", "club-leader", "super-admin"),
  ReportController.submitReport
);

// super-admin reviews report
router.patch(
  "/:id/review",
  authRequired,
  requireRole("super-admin"),
  ReportController.reviewReport
);

export default router;
