require("dotenv").config();
const app = require("./src/app");
const http = require("http");
const {Server} = require("socket.io");
const gameSocket = require("./src/sockets/gameSocket");
const chatSocket = require("./src/sockets/chatSocket");

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL,
].filter(Boolean);

const server = http.createServer(app);
//Allow Socket.IO connections from my React frontend
const io = new Server(server, {
  cors: {
    origin:allowedOrigins,
  },
});
gameSocket(io);
chatSocket(io);

const port = process.env.PORT || 3000;

server.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})
