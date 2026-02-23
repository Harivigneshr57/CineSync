import { io } from "socket.io-client";

export const socket = io("https://cinesync-3k1z.onrender.com", {
  path: "/socket.io",

  // ⭐ FORCE SAFE CONNECTION FOR RENDER
  transports: ["polling"],

  upgrade: true,          // allow upgrade later
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  timeout: 20000,
  withCredentials: false
});
