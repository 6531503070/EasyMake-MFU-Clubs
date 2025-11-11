import { Request, Response } from "express";
import { FileService } from "../services/FileService";

export const FileController = {
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const file = await FileService.readFileInfo(id);
      if (!file) return res.status(404).json({ message: "File not found" });

      const contentType =
        (file as any).contentType ||
        (file as any).metadata?.contentType ||
        "application/octet-stream";

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=600");

      const stream = FileService.openDownloadStreamById(id);
      stream.on("error", () => res.status(404).end());
      stream.pipe(res);
    } catch {
      res.status(400).json({ message: "Invalid file id" });
    }
  },
};
