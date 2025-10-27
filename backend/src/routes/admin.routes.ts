import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.get(
  "/audit-logs",
  authRequired,
  requireRole("super-admin"),
  AdminController.listAuditLogs
);

export default router;
