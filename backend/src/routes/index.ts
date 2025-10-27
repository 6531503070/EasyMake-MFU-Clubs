import { Router } from "express";
import authRoutes from "./auth.routes";
import clubsRoutes from "./clubs.routes";
import followRoutes from "./follow.routes";
import postsRoutes from "./posts.routes";
import activitiesRoutes from "./activities.routes";
import reportsRoutes from "./reports.routes";
import notificationsRoutes from "./notifications.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/clubs", clubsRoutes);
router.use("/follow", followRoutes);
router.use("/posts", postsRoutes);
router.use("/activities", activitiesRoutes);
router.use("/reports", reportsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/admin", adminRoutes);

export default router;
