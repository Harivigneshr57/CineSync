import { io } from "socket.io-client";

const socket = io("https://cinesync-3k1z.onrender.com", {
  path: "/socket.io",
  transports: ["polling", "websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export default socket;
