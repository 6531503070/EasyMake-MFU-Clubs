import { Router } from "express";
import { MeController } from "../controllers/MeController";
import { authRequired } from "../middleware/auth";

const router = Router();

router.get("/me", authRequired, MeController.getMe);

export default router;
