import {io} from "socket.io-client"

//connects React frontend to your Socket.IO backend server running on port 3000.
export const socket = io("http://localhost:3000");