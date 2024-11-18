export class MoneyGame {
  constructor() {
    this.score = 0;
    this.streak = 0;
    this.coins = [
      { value: 25, name: 'quarter', image: '🪙' },
      { value: 10, name: 'dime', image: '💿' },
      { value: 5, name: 'nickel', image: '⭐' },
      { value: 1, name: 'penny', image: '🟤' }
    ];
    this.level = 1;
    this.targetReached = false;
  }

  generateTarget() {
    // Increase difficulty with level
    const maxAmount = Math.min(25 + (this.level * 15), 99);
    return Math.floor(Math.random() * maxAmount) + 1;
  }

  start(gameArea, updateScoreCallback) {
    this.updateScoreCallback = updateScoreCallback;
    this.showProblem(gameArea);
  }

  updateLevel() {
    if (this.streak > 0 && this.streak % 3 === 0) {
      this.level++;
      return true;
    }
    return false;
  }

  showProblem(gameArea) {
    const target = this.generateTarget();
    let selectedCoins = [];
    this.targetReached = false;

    gameArea.innerHTML = `
      <div class="money-game">
        <div class="game-header">
          <div class="level-indicator">Level ${this.level}</div>
          <div class="streak-counter">Streak: ${this.streak} 🔥</div>
        </div>
        
        <div class="problem">Make ${target}¢</div>
        
        <div class="piggy-bank">
          <div class="selected-coins">
            Current: <span id="total">0</span>¢
            <div class="target-indicator">Target: ${target}¢</div>
            <div class="difference-indicator" id="difference"></div>
          </div>
        </div>

        <div class="coins-container">
          ${this.coins.map(coin => `
            <button class="coin-btn" data-value="${coin.value}">
              <span class="coin-image">${coin.image}</span>
              <span class="coin-value">${coin.value}¢</span>
            </button>
          `).join('')}
        </div>

        <div class="game-controls">
          <button id="undoButton" class="control-btn" disabled>Undo</button>
          <button id="resetButton" class="control-btn">Reset</button>
          <button id="checkMoney" class="control-btn check-btn" disabled>Check</button>
        </div>

        <div class="feedback"></div>
      </div>
    `;

    const updateUI = () => {
      const total = selectedCoins.reduce((sum, coin) => sum + coin, 0);
      const difference = target - total;
      const totalElement = document.getElementById('total');
      const differenceElement = document.getElementById('difference');
      const checkButton = document.getElementById('checkMoney');
      const undoButton = document.getElementById('undoButton');

      totalElement.textContent = total;
      
      if (total > 0) {
        if (difference > 0) {
          differenceElement.textContent = `Need ${difference}¢ more`;
          differenceElement.className = 'difference-indicator under';
        } else if (difference < 0) {
          differenceElement.textContent = `${Math.abs(difference)}¢ too much`;
          differenceElement.className = 'difference-indicator over';
        } else {
          differenceElement.textContent = 'Perfect amount! 🎯';
          differenceElement.className = 'difference-indicator perfect';
        }
      } else {
        differenceElement.textContent = '';
      }

      checkButton.disabled = total === 0;
      undoButton.disabled = selectedCoins.length === 0;
    };

    const addCoin = (value) => {
      if (!this.targetReached) {
        selectedCoins.push(value);
        updateUI();
      }
    };

    const resetGame = () => {
      selectedCoins = [];
      updateUI();
    };

    const undoLastCoin = () => {
      selectedCoins.pop();
      updateUI();
    };

    gameArea.querySelectorAll('.coin-btn').forEach(button => {
      button.addEventListener('click', () => {
        const value = parseInt(button.dataset.value);
        addCoin(value);
        button.classList.add('coin-clicked');
        setTimeout(() => button.classList.remove('coin-clicked'), 200);
      });
    });

    document.getElementById('resetButton').addEventListener('click', resetGame);
    document.getElementById('undoButton').addEventListener('click', undoLastCoin);

    document.getElementById('checkMoney').addEventListener('click', () => {
      const total = selectedCoins.reduce((sum, coin) => sum + coin, 0);
      const feedback = gameArea.querySelector('.feedback');
      this.targetReached = true;

      if (total === target) {
        this.streak++;
        const levelUp = this.updateLevel();
        const basePoints = 10;
        const streakBonus = Math.floor(this.streak / 3) * 5;
        const points = basePoints + streakBonus;
        this.score += points;

        feedback.innerHTML = `
          <div class="success-feedback">
            🎉 Perfect! +${points} points
            ${streakBonus > 0 ? `<br>Streak bonus: +${streakBonus}` : ''}
            ${levelUp ? '<br>🆙 Level Up!' : ''}
          </div>
        `;
        feedback.className = 'feedback success';
      } else {
        this.streak = 0;
        feedback.textContent = '❌ Not quite right. Try again!';
        feedback.className = 'feedback error';
      }

      this.updateScoreCallback();
      
      setTimeout(() => {
        this.showProblem(gameArea);
      }, 1500);
    });

    updateUI();
  }
}