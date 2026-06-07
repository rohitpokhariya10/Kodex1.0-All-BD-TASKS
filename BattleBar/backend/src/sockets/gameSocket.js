const { gameState, resetGameState } = require("../game/gameState");

const gameSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("playerClick", (click) => {
      if (gameState.winner) {
        return;
      }
      if (click === "green") {
        gameState.barValue += 1;
      }
      if (click === "red") {
        gameState.barValue -= 1;
      }
      if (gameState.barValue >= 100) {
        gameState.barValue = 100;
        gameState.winner = "Green Winner";
      }
      if (gameState.barValue <= 0) {
        gameState.barValue = 0;
        gameState.winner = "Red Winner";
      }
      io.emit("gameState", gameState);
    });

    socket.on("resetgame", () => {
      resetGameState();
      io.emit("gameState", gameState);
    });

    socket.on("disconnect", (socket) => {
      console.log("User disconnected" , socket.id);
    });
  });
};
module.exports = gameSocket;
