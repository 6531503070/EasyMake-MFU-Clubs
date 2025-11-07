import { Request, Response, NextFunction } from "express";
import { getGridFsBucket } from "../utils/gridfs";
import { ObjectId } from "mongodb";
import { HttpError } from "../utils/errors";

export const FileController = {
  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bucket = getGridFsBucket();
      const id = new ObjectId(req.params.id);

      const file = await bucket.find({ _id: id }).next();
      if (!file) throw new HttpError(404, "File not found");

      if (file.contentType) {
        res.setHeader("Content-Type", file.contentType);
      } else {
        res.setHeader("Content-Type", "application/octet-stream");
      }
      res.setHeader("Content-Disposition", `inline; filename="${file.filename}"`);

      const download = bucket.openDownloadStream(id);
      download.on("error", (err) => next(err));
      download.pipe(res);
    } catch (err) {
      next(err);
    }
  },
};
