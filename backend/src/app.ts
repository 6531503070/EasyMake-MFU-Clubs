import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { HttpError } from "./utils/errors";
import swaggerRouter from "./swagger";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./middleware/cors";

const app = express();

app.use(corsMiddleware);
app.use(cookieParser());
app.use(express.json());

// Swagger UI at /docs
app.use("/docs", swaggerRouter);

// All API routes under /api
app.use("/api", routes);

// healthcheck
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// error handler
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[ERR]", err);
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default app;
