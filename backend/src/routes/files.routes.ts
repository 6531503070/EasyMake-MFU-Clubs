import { Router } from "express";
import { FileController } from "../controllers/FileController";

const router = Router();

router.get("/:id", FileController.getById);

export default router;
