import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { HttpError } from "./utils/errors";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api", routes);

// healthcheck
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// error handler (last)
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
