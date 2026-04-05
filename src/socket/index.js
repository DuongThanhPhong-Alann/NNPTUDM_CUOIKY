const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const nguoiDungController = require("../controllers/nguoidungs");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.replace(/^Bearer\s+/i, "");

      if (!token) return next(new Error("Unauthorized"));

      const secret = process.env.JWT_SECRET;
      if (!secret) return next(new Error("Missing JWT secret"));

      const payload = jwt.verify(token, secret);
      const user = await nguoiDungController.GetById(payload.id);
      if (!user) return next(new Error("Unauthorized"));

      socket.user = user;
      return next();
    } catch (_error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);

    socket.on("chat:join", (sessionId) => {
      socket.join(`chat:${sessionId}`);
    });

    socket.on("chat:leave", (sessionId) => {
      socket.leave(`chat:${sessionId}`);
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };
