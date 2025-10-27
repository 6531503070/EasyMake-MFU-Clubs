import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { requireClubStaff } from "../middleware/clubRoleGuard";

const router = Router();

// create post in club
router.post(
  "/clubs/:clubId/posts",
  authRequired,
  requireRole("club-leader", "super-admin", "user"),
  requireClubStaff,
  PostController.createPost
);

// list posts public
router.get(
  "/clubs/:clubId/posts",
  PostController.listPostsPublic
);

// delete/soft delete
router.delete(
  "/posts/:postId",
  authRequired,
  PostController.softDeletePost
);

export default router;
