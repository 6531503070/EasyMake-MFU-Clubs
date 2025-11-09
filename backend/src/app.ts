import express from "express";
import routes from "./routes/index";
import swaggerRouter from "./swagger";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middleware/cors";
import multer from "multer";

const app = express();

app.use(corsMiddleware);
app.use(cookieParser());

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.use("/docs", swaggerRouter);
app.use("/api", routes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large" });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res
          .status(400)
          .json({ message: "Only image files are allowed" });
      }
      return res.status(400).json({ message: err.message });
    }
    return next(err);
  }
);

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[ERR]", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

export default app;
