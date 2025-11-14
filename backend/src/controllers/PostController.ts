import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/PostService";
import { FileService } from "../services/FileService";
import { makeFileUrl, toUrlIfId } from "../utils/url";

function parseMaybeJson<T>(val: any): T | undefined {
  if (val == null) return undefined;
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T;
    } catch {}
  }
  return val as T;
}

async function saveUploadedImagesToUrls(
  req: Request,
  files?: Express.Multer.File[]
) {
  if (!files?.length) return [] as string[];
  const urls: string[] = [];
  for (const f of files) {
    const id = await FileService.saveBufferToGridFS(f.buffer, {
      filename: f.originalname,
      contentType: f.mimetype,
      metadata: { fieldname: f.fieldname },
    });
    urls.push(makeFileUrl(req, id));
  }
  return urls;
}

export const PostController = {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorUserId = (req as any).user.id as string;
      const { clubId } = req.params;

      const title = (req.body.title ?? "").trim();
      const content = (req.body.content ?? "") as string;

      const imagesFromBody = (
        parseMaybeJson<string[]>(req.body.images) || []
      ).map((s) => toUrlIfId(req, s));

      const allFiles = (req.files as Express.Multer.File[]) || [];
      const newImages = allFiles.filter((f) => f.fieldname === "images");
      const uploadedUrls = await saveUploadedImagesToUrls(req, newImages);

      const images = [...imagesFromBody, ...uploadedUrls];

      const post = await PostService.createPost(authorUserId, clubId, {
        title,
        content,
        images,
      });

      res.json({ post });
    } catch (err) {
      next(err);
    }
  },

  updatePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actorUserId = (req as any).user.id as string;
      const { postId } = req.params;

      const title = req.body.title as string | undefined;
      const content = req.body.content as string | undefined;
      const published =
        typeof req.body.published === "string"
          ? req.body.published === "true"
          : typeof req.body.published === "boolean"
          ? req.body.published
          : undefined;

      const existingIds = parseMaybeJson<string[]>(req.body.existingIds) ?? [];

      const files = req.files as
        | Record<string, Express.Multer.File[]>
        | undefined;
      const imagesFiles = files?.images ?? [];
      const newImagesFiles = files?.newImages ?? [];

      const uploadedFromImages = await saveUploadedImagesToUrls(
        req,
        imagesFiles
      );
      const uploadedFromNew = await saveUploadedImagesToUrls(
        req,
        newImagesFiles
      );

      const post = await PostService.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });

      const keepImages = existingIds.map((s) => toUrlIfId(req, s));
      const oldImages = Array.isArray(post.images) ? post.images : [];

      const removed = oldImages.filter(
        (url: string) => !keepImages.includes(url)
      );
      if (removed.length > 0) {
        const ids = removed
          .map((url: string) => url.split("/").pop())
          .filter((id): id is string => !!id && /^[a-f0-9]{24}$/.test(id));
        if (ids.length > 0) {
          await FileService.deleteMany(ids);
        }
      }

      const finalImages = [
        ...keepImages,
        ...uploadedFromImages,
        ...uploadedFromNew,
      ];

      const updated = await PostService.updatePost(postId, actorUserId, {
        title,
        content,
        published,
        images: finalImages,
      });

      res.json({ post: updated });
    } catch (err) {
      console.error("[updatePost ERR]", err);
      res.status(500).json({ error: "Internal Server Error" });
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

  listPostsForClubStaff: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const staffUserId = (req as any).user.id as string;
      const { clubId } = req.params;
      const posts = await PostService.listPostsForClubStaff(
        staffUserId,
        clubId
      );
      res.json({ posts });
    } catch (err) {
      next(err);
    }
  },

  deletePost: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actorUserId = (req as any).user.id as string;
      const isSuperAdmin = (req as any).user.role === "super-admin";
      const { postId } = req.params;

      const result = await PostService.deletePost(
        postId,
        actorUserId,
        isSuperAdmin
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
  listPostsFeedPublic: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = (req as any).user?.id as string | undefined;
      const posts = await PostService.listPublicFeed(userId);
      res.json({ posts });
    } catch (err) {
      next(err);
    }
  },

  toggleLike: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id as string;
      const { postId } = req.params;
      const result = await PostService.toggleLike(postId, userId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
