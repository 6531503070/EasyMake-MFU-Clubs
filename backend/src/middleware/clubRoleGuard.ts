import { Request, Response, NextFunction } from "express";
import { ClubModel } from "../models/Club.model";
import { ClubFollowerModel } from "../models/ClubFollower.model";

export async function requireClubStaff(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).user?.id;
    const { clubId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "unauthenticated" });
    }

    const club = await ClubModel.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: "club not found" });
    }

    if (club.leader_user_id === userId) {
      return next();
    }

    const rel = await ClubFollowerModel.findOne({
      club_id: clubId,
      user_id: userId,
      role_at_club: { $in: ["co-leader"] },
    }).lean();

    if (!rel) {
      return res.status(403).json({ message: "not club staff" });
    }

    next();
  } catch (err) {
    next(err);
  }
}
