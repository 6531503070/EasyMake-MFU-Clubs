import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { requireClubStaff } from "../middleware/clubRoleGuard";

const router = Router();

// create post
router.post(
  "/clubs/:clubId/posts",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  PostController.createPost
);

// public list
router.get("/clubs/:clubId/posts", PostController.listPostsPublic);

// update post
router.patch(
  "/posts/:postId",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  PostController.updatePost
);

// delete post
router.delete(
  "/posts/:postId",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  PostController.softDeletePost
);

export default router;
