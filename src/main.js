import { MathGame } from './games/math.js';
import { MoneyGame } from './games/money.js';
import { ClockGame } from './games/clock.js';

class GameManager {
  constructor() {
    this.currentGame = null;
    this.score = 0;
    this.games = {
      math: new MathGame(),
      money: new MoneyGame(),
      clock: new ClockGame()
    };
    
    this.initializeEventListeners();
    this.updateScore();
  }

  initializeEventListeners() {
    document.querySelectorAll('.game-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const gameButton = e.target.closest('.game-btn');
        if (gameButton) {
          const gameType = gameButton.dataset.game;
          this.startGame(gameType);
        }
      });
    });
  }

  startGame(gameType) {
    if (this.games[gameType]) {
      const gameArea = document.getElementById('gameArea');
      gameArea.innerHTML = '';
      
      this.currentGame = this.games[gameType];
      this.currentGame.start(gameArea, this.updateScore.bind(this));
    }
  }

  updateScore() {
    const totalScore = Object.values(this.games)
      .reduce((sum, game) => sum + game.score, 0);
    document.getElementById('scoreValue').textContent = totalScore;
  }
}

// Initialize the game
new GameManager();