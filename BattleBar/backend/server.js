const app = require("./src/app");
const http = require("http");
const {Server} = require("socket.io");
const gameSocket = require("./src/sockets/gameSocket");
const chatSocket = require("./src/sockets/chatSocket");


const httpServer = http.createServer(app);
//Allow Socket.IO connections from my React frontend
const io = new Server(httpServer , {
    cors:{
        origin:"http://localhost:5173",
        
    }
});
gameSocket(io);
chatSocket(io);
let port = 3000 || 8000;
httpServer.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})