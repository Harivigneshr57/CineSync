import { io } from "socket.io-client";

export const socket = io("https://cinesync-3k1z.onrender.com", {
    autoConnect: false
});