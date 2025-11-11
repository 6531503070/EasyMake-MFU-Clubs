import { Router } from "express";
import { PostController } from "../controllers/PostController";
import { authRequired } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";
import { requireClubStaff } from "../middleware/clubRoleGuard";
import { upload } from "../middleware/upload";

const router = Router();

// create post
router.post(
  "/clubs/:clubId/posts",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  upload.array("images", 10), 
  PostController.createPost
);
// manage list
router.get(
  "/clubs/:clubId/posts/manage",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  requireClubStaff,
  PostController.listPostsForClubStaff
);

// public list
router.get("/clubs/:clubId/posts", PostController.listPostsPublic);

// delete post
router.delete(
  "/:postId",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  PostController.deletePost
);

// update post
router.patch(
  "/:postId",
  authRequired,
  requireRole("club-leader", "co-leader", "super-admin"),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "newImages", maxCount: 10 },
  ]),
  PostController.updatePost
);




export default router;
