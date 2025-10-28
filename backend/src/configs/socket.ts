import { Server } from "socket.io";
import { verifyJWT } from "../middleware/auth";

let io: Server | null = null;

export function initSocket(httpServer: any) {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use((socket, next) => {
    const token =
      (socket.handshake.auth && socket.handshake.auth.token) ||
      (socket.handshake.query && socket.handshake.query.token);

    if (!token || typeof token !== "string") {
      return next(new Error("NO_AUTH"));
    }

    try {
      const user = verifyJWT(token);
      // @ts-ignore
      socket.user = user;
      return next();
    } catch {
      return next(new Error("BAD_TOKEN"));
    }
  });

  io.on("connection", (socket) => {
    // @ts-ignore
    const user = socket.user;
    const room = "user:" + user.id;
    socket.join(room);
    console.log("[SOCKET] user joined room", room);

    socket.on("disconnect", () => {
      console.log("[SOCKET] user disconnected", user.id);
    });
  });

  console.log("[SOCKET] initialized");
}

export function emitToUser(userId: string, event: string, payload: any) {
  if (!io) return;
  io.to("user:" + userId).emit(event, payload);
}
