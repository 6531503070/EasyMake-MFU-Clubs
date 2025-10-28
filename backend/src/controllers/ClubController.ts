import { Request, Response, NextFunction } from "express";
import { ClubService } from "../services/ClubService";
import { ClubImageService } from "../services/ClubImageService";

export const ClubController = {
  createClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const leaderUserId = (req as any).user.id;
      const club = await ClubService.createClub(leaderUserId, req.body);
      res.json({ club });
    } catch (err) {
      next(err);
    }
  },

  getClubPublic: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clubId } = req.params;
      const club = await ClubService.getClubPublic(clubId);
      res.json({ club });
    } catch (err) {
      next(err);
    }
  },

  updateClubProfileSelf: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requesterUserId = (req as any).user.id;
      const { clubId } = req.params;
      const updatedClub = await ClubService.updateClubProfileByLeader(
        requesterUserId,
        clubId,
        req.body
      );
      res.json({ club: updatedClub });
    } catch (err) {
      next(err);
    }
  },

  listMembers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requesterUserId = (req as any).user.id;
      const { clubId } = req.params;
      const members = await ClubService.listClubMembers(
        requesterUserId,
        clubId
      );
      res.json({ members });
    } catch (err) {
      next(err);
    }
  },

  listActivities: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requesterUserId = (req as any).user.id;
      const { clubId } = req.params;
      const activities = await ClubService.listClubActivities(
        requesterUserId,
        clubId
      );
      res.json({ activities });
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
      const requesterUserId = (req as any).user.id;
      const { clubId } = req.params;
      const posts = await ClubService.listPostsForClubStaff(
        requesterUserId,
        clubId
      );
      res.json({ posts });
    } catch (err) {
      next(err);
    }
  },
  updateClubCoverImage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const requesterUserId = (req as any).user.id;
      const { clubId } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await ClubImageService.updateCoverImage({
        requesterUserId,
        clubId,
        fileBuffer: req.file.buffer,
        mimeType: req.file.mimetype,
        originalName: req.file.originalname,
      });

      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getClubCoverImage: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { clubId } = req.params;

      const img = await ClubImageService.getCoverImageStream(clubId);
      if (!img) {
        return res.status(404).json({ message: "No cover image" });
      }

      res.setHeader("Content-Type", img.mime);

      img.stream.on("error", (err) => {
        next(err);
      });

      img.stream.pipe(res);
    } catch (err) {
      next(err);
    }
  },
};
