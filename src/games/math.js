export class MathGame {
  constructor() {
    this.score = 0;
    this.currentProblem = null;
  }

  generateProblem() {
    const operations = ['+', '-'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2;

    if (operation === '+') {
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * 20) + 1;
    } else {
      num1 = Math.floor(Math.random() * 20) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
    }

    const answer = operation === '+' ? num1 + num2 : num1 - num2;
    return {
      question: `${num1} ${operation} ${num2}`,
      answer,
      options: this.generateOptions(answer)
    };
  }

  generateOptions(answer) {
    const options = [answer];
    while (options.length < 4) {
      const option = answer + Math.floor(Math.random() * 10) - 5;
      if (!options.includes(option) && option >= 0) {
        options.push(option);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  }

  start(gameArea, updateScoreCallback) {
    this.updateScoreCallback = updateScoreCallback;
    this.showProblem(gameArea);
  }

  showProblem(gameArea) {
    this.currentProblem = this.generateProblem();
    
    gameArea.innerHTML = `
      <div class="problem">${this.currentProblem.question} = ?</div>
      <div class="options">
        ${this.currentProblem.options.map(option => `
          <button class="option-btn" data-value="${option}">${option}</button>
        `).join('')}
      </div>
      <div class="feedback"></div>
    `;

    gameArea.querySelectorAll('.option-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        this.checkAnswer(parseInt(e.target.dataset.value), gameArea);
      });
    });
  }

  checkAnswer(selectedAnswer, gameArea) {
    const feedback = gameArea.querySelector('.feedback');
    const isCorrect = selectedAnswer === this.currentProblem.answer;

    if (isCorrect) {
      this.score += 10;
      feedback.textContent = '🎉 Correct! Great job!';
      feedback.style.color = '#4CAF50';
    } else {
      feedback.textContent = '❌ Try again!';
      feedback.style.color = '#f44336';
    }

    this.updateScoreCallback();
    
    setTimeout(() => {
      this.showProblem(gameArea);
    }, 1500);
  }
}