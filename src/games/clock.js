export class ClockGame {
  constructor() {
    this.score = 0;
  }

  generateTime() {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 4) * 15;
    return { hours, minutes };
  }

  start(gameArea, updateScoreCallback) {
    this.updateScoreCallback = updateScoreCallback;
    this.showProblem(gameArea);
  }

  drawClock(canvas, hours, minutes) {
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw clock face background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw hour marks
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      const isMainMark = i % 3 === 0;
      const markLength = isMainMark ? 20 : 10;
      
      const x1 = centerX + (radius - markLength) * Math.cos(angle);
      const y1 = centerY + (radius - markLength) * Math.sin(angle);
      const x2 = centerX + radius * Math.cos(angle);
      const y2 = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineWidth = isMainMark ? 3 : 2;
      ctx.stroke();

      // Draw hour numbers
      if (isMainMark) {
        const number = i === 0 ? 12 : i / 3 * 3;
        const textX = centerX + (radius - 35) * Math.cos(angle);
        const textY = centerY + (radius - 35) * Math.sin(angle);
        
        ctx.font = 'bold 20px Inter';
        ctx.fillStyle = '#1e293b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(number.toString(), textX, textY);
      }
    }

    // Draw center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#6366f1';
    ctx.fill();

    // Draw hands with gradient
    const hourAngle = (hours % 12 + minutes / 60) * Math.PI / 6 - Math.PI / 2;
    const minuteAngle = minutes * Math.PI / 30 - Math.PI / 2;

    // Hour hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.5 * Math.cos(hourAngle),
      centerY + radius * 0.5 * Math.sin(hourAngle)
    );
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Minute hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.7 * Math.cos(minuteAngle),
      centerY + radius * 0.7 * Math.sin(minuteAngle)
    );
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  showProblem(gameArea) {
    const time = this.generateTime();
    
    gameArea.innerHTML = `
      <div class="clock-game">
        <div class="problem">What time is shown on the clock?</div>
        <canvas id="clockCanvas" width="300" height="300"></canvas>
        <div class="time-input">
          <select id="hours">
            ${Array.from({length: 12}, (_, i) => i + 1)
              .map(h => `<option value="${h}">${h}</option>`)}
          </select>
          :
          <select id="minutes">
            ${[0, 15, 30, 45]
              .map(m => `<option value="${m}">${m.toString().padStart(2, '0')}</option>`)}
          </select>
          <button id="checkTime">Check Answer</button>
        </div>
        <div class="feedback"></div>
      </div>
    `;

    const canvas = document.getElementById('clockCanvas');
    this.drawClock(canvas, time.hours, time.minutes);

    document.getElementById('checkTime').addEventListener('click', () => {
      const selectedHours = parseInt(document.getElementById('hours').value);
      const selectedMinutes = parseInt(document.getElementById('minutes').value);
      const feedback = gameArea.querySelector('.feedback');

      if (selectedHours === time.hours && selectedMinutes === time.minutes) {
        this.score += 10;
        feedback.innerHTML = '🎉 Correct! You\'re a time master!';
        feedback.className = 'feedback success';
      } else {
        feedback.innerHTML = '❌ That\'s not quite right. Try again!';
        feedback.className = 'feedback error';
      }

      this.updateScoreCallback();
      
      setTimeout(() => {
        this.showProblem(gameArea);
      }, 1500);
    });
  }
}