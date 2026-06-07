const app = require("./src/app");
const http = require("http");
const {Server} = require("socket.io");



const httpServer = http.createServer(app);
const io = new Server(httpServer);


let port = 3000 || 8000;
httpServer.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})