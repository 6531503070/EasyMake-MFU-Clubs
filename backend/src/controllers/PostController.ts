import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/PostService";

export const PostController = {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorUserId = (req as any).user.id;
      const { clubId } = req.params;
      const post = await PostService.createPost(authorUserId, clubId, req.body);
      res.json({ post });
    } catch (err) {
      next(err);
    }
  },

  listPostsPublic: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clubId } = req.params;
      const posts = await PostService.listPostsPublic(clubId);
      res.json({ posts });
    } catch (err) {
      next(err);
    }
  },

  softDeletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actorUserId = (req as any).user.id;
      const isSuperAdmin = (req as any).user.role === "super-admin";
      const { postId } = req.params;
      const post = await PostService.softDeletePost(postId, actorUserId, isSuperAdmin);
      res.json({ post });
    } catch (err) {
      next(err);
    }
  },
};
