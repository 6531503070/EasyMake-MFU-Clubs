import cors from "cors";

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:3000"];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, 
  optionsSuccessStatus: 200, 
});
