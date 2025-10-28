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

export function authRequired(req: Request, _res: Response, next: NextFunction) {
  let token: string | undefined;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else {
    const header = req.headers.authorization;
    if (header) {
      const [type, raw] = header.split(" ");
      if (type === "Bearer" && raw) {
        token = raw;
      }
    }
  }

  if (!token) {
    return next(new HttpError(401, "Unauthorized"));
  }

  try {
    const decoded = verifyJWT(token);
    (req as any).user = decoded;
    next();
  } catch {
    next(new HttpError(401, "Invalid token"));
  }
}
