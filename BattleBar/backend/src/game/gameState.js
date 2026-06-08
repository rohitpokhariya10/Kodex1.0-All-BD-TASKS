const gameState = {
  barValue: 50,
  winner: null,
  blueClicks: 0,
  redClicks: 0,
  timeLeft: 60,
  isGameRunning: false,
};

const resetGameState = () => {
  gameState.barValue = 50;
  gameState.winner = null;
  gameState.blueClicks = 0;
  gameState.redClicks = 0;
  gameState.timeLeft = 60;
  gameState.isGameRunning = false;
};

module.exports = { gameState, resetGameState };