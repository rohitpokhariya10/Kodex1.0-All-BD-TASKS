const { gameState, resetGameState } = require("../game/gameState");

const gameSocket = (io) => {
  let gameTimer = null;
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("teamClick", (team) => {
      if (gameState.winner) {
        return;
      }
      //
      if (!gameTimer) {
        gameTimer = setTimeout(() => {
          if (gameState.barValue > 50) {
            gameState.winner = "Green Winner";
          } else if (gameState.barValue < 50) {
            gameState.winner = "Red Winner";
          } else {
            gameState.winner = "Draw";
          }
          io.emit("gameState", gameState);
          gameTimer = null;
        }, 60000);
      }

      if (team === "green") {
        gameState.barValue += 1;
      }
      if (team === "red") {
        gameState.barValue -= 1;
      }
      if (gameState.barValue >= 100) {
        gameState.barValue = 100;
        gameState.winner = "Green Winner";
        clearInterval(gameTimer);
        gameTimer = null;
      }
      if (gameState.barValue <= 0) {
        gameState.barValue = 0;
        gameState.winner = "Red Winner";
        clearInterval(gameTimer);
        gameTimer = null;
      }
      io.emit("gameState", gameState);
    });

    socket.on("resetGame", () => {
      resetGameState();
      if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
      }
      io.emit("gameState", gameState);
    });

    socket.on("disconnect", (socket) => {
      console.log("User disconnected", socket.id);
    });
  });
};
module.exports = gameSocket;
