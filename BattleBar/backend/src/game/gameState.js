const gameState = {
  barValue: 50,
  winner: null,
};

const resetGameState = () => {
  gameState.barValue = 0;
  gameState.winner = null;
};

module.exports = {gameState , resetGameState}