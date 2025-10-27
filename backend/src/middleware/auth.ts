import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../utils/errors";
import { env } from "../configs/env";

export function signJWT(payload: any) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJWT(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
}

// Express middleware
export function authRequired(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return next(new HttpError(401, "Missing Authorization header"));
  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token)
    return next(new HttpError(401, "Invalid Authorization header"));

  try {
    const decoded = verifyJWT(token);
    (req as any).user = decoded;
    next();
  } catch {
    next(new HttpError(401, "Invalid token"));
  }
}
