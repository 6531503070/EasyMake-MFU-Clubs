import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User.model";
import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";

export const MeController = {
  getMe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "unauthenticated" });
      }

      const me = await UserModel.findById(
        userId,
        "_id full_name email role is_founder_for_club_id"
      ).lean();

      if (!me) {
        return res.status(404).json({ message: "user not found" });
      }

      let clubId: string | null = null;

      const leaderClub = await ClubModel.findOne(
        { leader_user_id: userId },
        "_id"
      ).lean();
      if (leaderClub) {
        clubId = String(leaderClub._id);
      }

      if (!clubId) {
        const coRel = await ClubFollowerModel.findOne(
          {
            user_id: userId,
            role_at_club: { $in: ["co-leader"] },
          },
          "club_id"
        ).lean();

        if (coRel) {
          clubId = String(coRel.club_id);
        }
      }

      if (!clubId && me.is_founder_for_club_id) {
        clubId = String(me.is_founder_for_club_id);
      }

      return res.json({
        me: {
          userId,
          full_name: me.full_name || "",
          email: me.email || "",
          role: me.role,
          clubId: clubId || null,
        },
      });
    } catch (err) {
      next(err);
    }
  },
  listFollowingClubs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "unauthenticated" });
      }

      const rels = await ClubFollowerModel.find(
        { user_id: userId, role_at_club: "member" },
        "club_id"
      ).lean();

      const clubIds = rels.map((r) => r.club_id);
      if (!clubIds.length) {
        return res.json({ clubs: [] });
      }

      const clubs = await ClubModel.find(
        { _id: { $in: clubIds } },
        "_id name cover_image_url tagline"
      ).lean();

      res.json({
        clubs: clubs.map((c) => ({
          _id: c._id,
          name: c.name,
          cover_image_url: c.cover_image_url || "",
          tagline: c.tagline || "",
        })),
      });
    } catch (err) {
      next(err as any);
    }
  },
};
