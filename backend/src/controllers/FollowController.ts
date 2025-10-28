import { Request, Response, NextFunction } from "express";
import { FollowService } from "../services/FollowService";

export const FollowController = {
  followClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { clubId } = req.params;
      const rel = await FollowService.followClub(userId, clubId);
      res.json({ follower: rel });
    } catch (err) {
      next(err);
    }
  },

  unfollowClub: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { clubId } = req.params;
      const rel = await FollowService.unfollowClub(userId, clubId);
      res.json({ unfollowed: rel });
    } catch (err) {
      next(err);
    }
  },

  // NEW: leader/staff can view members/followers list
  listClubFollowers: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const staffUserId = (req as any).user.id;
      const { clubId } = req.params;
      const members = await FollowService.listClubFollowers(
        staffUserId,
        clubId
      );
      res.json({ members });
    } catch (err) {
      next(err);
    }
  },
};
