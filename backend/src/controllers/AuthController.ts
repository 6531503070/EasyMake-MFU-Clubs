import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

export const AuthController = {
  registerNormal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, citizen_id, full_name, phone } = req.body;
      const result = await AuthService.registerUserNormal({
        email,
        password,
        citizen_id,
        full_name,
        phone,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  oauthGoogleCallback: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, google_id, full_name } = req.body;
      const result = await AuthService.registerOrAttachGoogle({
        email,
        google_id,
        full_name,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  createClubLeader: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const superAdminId = (req as any).user.id;
      const { email, citizen_id, full_name, phone } = req.body;
      const leader = await AuthService.createClubLeader(superAdminId, {
        email, citizen_id, full_name, phone,
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
