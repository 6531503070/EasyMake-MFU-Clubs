import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/errors";

export function requireRole(...rolesAllowed: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const current = (req as any).user;
    if (!current) return next(new HttpError(401, "Auth required"));
    if (!rolesAllowed.includes(current.role)) {
      return next(new HttpError(403, "Forbidden"));
    }
    next();
  };
}
