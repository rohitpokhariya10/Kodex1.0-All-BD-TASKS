const app = require("./src/app");
const http = require("http");
const {Server} = require("socket.io");
const gameSocket = require("./src/sockets/gameSocket");


const httpServer = http.createServer(app);
const io = new Server(httpServer);
gameSocket(io);

let port = 3000 || 8000;
httpServer.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})