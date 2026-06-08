const gameState = {
  barValue: 50,
  winner: null,
  blueClicks: 0,
  redClicks: 0,
  timeLeft: 60,

};

const resetGameState = () => {
  gameState.barValue = 50;
  gameState.winner = null;
  gameState.blueClicks = 0;
  gameState.redClicks = 0;
  gameState.timeLeft = 60;

};

module.exports = { gameState, resetGameState };