const { gameState, resetGameState } = require("../game/gameState");

const gameSocket = (io) => {
  let gameTimer = null;

  const endGameByTime = () => {
    if (gameState.barValue > 50) {
      gameState.winner = "Blue Winner";
    } else if (gameState.barValue < 50) {
      gameState.winner = "Red Winner";
    } else {
      gameState.winner = "Draw";
    }
  };

  const startTimer = () => {
    if (gameTimer) return;

    gameTimer = setInterval(() => {
      gameState.timeLeft -= 1;

      if (gameState.timeLeft <= 0) {
        gameState.timeLeft = 0;
        endGameByTime();

        clearInterval(gameTimer);
        gameTimer = null;
      }

      io.emit("gameState", gameState);
    }, 1000);
  };

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.emit("gameState", gameState);

    socket.on("teamClick", (team) => {
      console.log("teamClicked event received", team);

      if (gameState.winner) {
        return;
      }

      startTimer();

      if (team === "blue") {
        gameState.barValue += 1;
        gameState.blueClicks += 1;
      }

      if (team === "red") {
        gameState.barValue -= 1;
        gameState.redClicks += 1;
      }

      if (gameState.barValue >= 100) {
        gameState.barValue = 100;
        gameState.winner = "Blue Winner";

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

    socket.on("disconnect", (reason) => {
      console.log("User disconnected", reason, socket.id);
    });
  });
};

module.exports = gameSocket;