import {io} from "socket.io-client"

const envSocketUrl = import.meta.env.VITE_SOCKET_URL;
const socketUrl =
  import.meta.env.PROD && envSocketUrl?.includes("localhost")
    ? window.location.origin
    : envSocketUrl || window.location.origin;

export const socket = io(socketUrl);
