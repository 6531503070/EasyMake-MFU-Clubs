import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

function setAuthCookies(
  res: Response,
  token: string,
  role: string,
  email: string
) {
  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("role", role, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("email", email, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const AuthController = {
  registerNormal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, citizen_id, full_name, phone } = req.body;
      const { user, token } = await AuthService.registerUserNormal({
        email,
        password,
        citizen_id,
        full_name,
        phone,
      });

      setAuthCookies(res, token, user.role, user.email);

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          is_active: user.is_active,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  createSuperAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, secret, full_name, phone } = req.body;
      const { user, token } = await AuthService.createSuperAdmin({
        email,
        password,
        secret,
        full_name,
        phone,
      });

      setAuthCookies(res, token, user.role, user.email);

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          is_active: user.is_active,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await AuthService.login(email, password);

      setAuthCookies(res, token, user.role, user.email);

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          is_active: user.is_active,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  oauthGoogleCallback: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { email, google_id, full_name } = req.body;
      const { user, token } = await AuthService.registerOrAttachGoogle({
        email,
        google_id,
        full_name,
      });

      setAuthCookies(res, token, user.role, user.email);

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          is_active: user.is_active,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  createClubLeader: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { email, citizen_id, full_name, phone } = req.body;
      const leader = await AuthService.createClubLeader(superAdminId, {
        email,
        citizen_id,
        full_name,
        phone,
      });
      res.json({ leader });
    } catch (err) {
      next(err);
    }
  },

  deactivateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { userId } = req.params;
      const user = await AuthService.deactivateUser(superAdminId, userId);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  },
};
