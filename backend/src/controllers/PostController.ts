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

    const imagesFromBody =
      (parseMaybeJson<string[]>(req.body.images) || []).map((s) =>
        toUrlIfId(req, s)
      );

    const existingIds =
      (parseMaybeJson<string[]>(req.body.existingIds) || imagesFromBody).map(
        (s) => toUrlIfId(req, s)
      );

    let imagesFiles: Express.Multer.File[] = [];
    let newImagesFiles: Express.Multer.File[] = [];

    if (Array.isArray(req.files)) {
      const arr = req.files as Express.Multer.File[];
      imagesFiles = arr.filter((f) => f.fieldname === "images");
      newImagesFiles = arr.filter((f) => f.fieldname === "newImages");
    } else if (req.files) {
      const filesObj = req.files as Record<string, Express.Multer.File[]>;
      imagesFiles = Array.isArray(filesObj.images) ? filesObj.images : [];
      newImagesFiles = Array.isArray(filesObj.newImages)
        ? filesObj.newImages
        : [];
    }

    const uploadedFromImages = await saveUploadedImagesToUrls(req, imagesFiles);
    const uploadedFromNew = await saveUploadedImagesToUrls(req, newImagesFiles);

    const finalImages = [
      ...existingIds,           
      ...uploadedFromImages,     
      ...uploadedFromNew,         
    ];

    const post = await PostService.updatePost(postId, actorUserId, {
      title,
      content,
      published,
      images: finalImages.length ? finalImages : undefined,
    });

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

      const result = await PostService.deletePost(postId, actorUserId, isSuperAdmin);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
