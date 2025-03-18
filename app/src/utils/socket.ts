import { io, Socket } from "socket.io-client";
import { env } from "./env";

export const socket: Socket = io(env.SOCKET_URL, {
  autoConnect: false,
});
