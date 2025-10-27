// ensure caller is leader/co-leader/staff of that club OR super-admin
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errors";
import { ClubFollowerModel } from "../models/ClubFollower.model";
import { ClubModel } from "../models/Club.model";

export async function requireClubStaff(req: Request, _res: Response, next: NextFunction) {
  const { clubId } = req.params;
  const current = (req as any).user;
  if (!current) return next(new HttpError(401, "Auth required"));

  // super-admin always OK
  if (current.role === "super-admin") return next();

  const club = await ClubModel.findById(clubId);
  if (!club) return next(new HttpError(404, "Club not found"));

  if (club.leader_user_id === current.id) return next();

  const rel = await ClubFollowerModel.findOne({
    club_id: clubId,
    user_id: current.id,
    role_at_club: { $in: ["co-leader", "staff"] },
  });

  if (!rel) return next(new HttpError(403, "Not allowed for this club"));
  next();
}
