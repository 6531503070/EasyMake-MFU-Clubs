import "dotenv/config"; 
import http from "http";
import app from "./app";
import { connectDB } from "./configs/db";
import { initSocket } from "./configs/socket";
import { env } from "./configs/env";

async function start() {
  await connectDB();

  const server = http.createServer(app);

  initSocket(server);

  server.listen(env.PORT, () => {
    console.log(`[SERVER] running on :${env.PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
