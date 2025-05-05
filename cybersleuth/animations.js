// Digital Rain Effect
const rainCanvas = document.getElementById('digital-rain-canvas');
const rainCtx = rainCanvas.getContext('2d');
function resizeRainCanvas() {
  rainCanvas.width = window.innerWidth;
  rainCanvas.height = window.innerHeight;
}
resizeRainCanvas();
window.addEventListener('resize', resizeRainCanvas);

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
const fontSize = 14;
const colors = ['#ef4444', '#facc15', '#22c55e', '#a855f7'];
const columns = Math.floor(rainCanvas.width / fontSize);
const drops = Array(columns).fill(0);

function drawDigitalRain() {
  rainCtx.fillStyle = 'rgba(17, 24, 39, 0.1)';
  rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
  rainCtx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    rainCtx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    rainCtx.fillText(char, x, y);

    if (y > rainCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += 0.3333;
  }
}

function animateDigitalRain() {
  drawDigitalRain();
  requestAnimationFrame(animateDigitalRain);
}
animateDigitalRain();

// Dice Animation with Physics
const diceCanvas = document.getElementById('dice-canvas');
const diceCtx = diceCanvas.getContext('2d');
const diceResult = document.getElementById('dice-result');

function resizeDiceCanvas() {
  diceCanvas.width = diceCanvas.offsetWidth;
  diceCanvas.height = diceCanvas.offsetHeight;
}
resizeDiceCanvas();
window.addEventListener('resize', resizeDiceCanvas);

function clearDiceCanvas() {
  diceCtx.fillStyle = 'rgba(17, 24, 39, 0.9)';
  diceCtx.fillRect(0, 0, diceCanvas.width, diceCanvas.height);
}

const dice = [
  { x: 50, y: 50, vx: 5, vy: 3, angle: 0, angularV: 0.1, size: 30, face: 1 },
  { x: 100, y: 50, vx: -4, vy: 4, angle: 0, angularV: -0.15, size: 30, face: 1 }
];
let tray = { left: 10, right: diceCanvas.width - 10, top: 10, bottom: diceCanvas.height - 10 };
let animationStart = 0;
let animationFrameId = null;

function drawDie(die, isStopped) {
  diceCtx.save();
  diceCtx.translate(die.x, die.y);
  diceCtx.rotate(die.angle);
  diceCtx.fillStyle = '#ffffff';
  diceCtx.strokeStyle = '#3b82f6';
  diceCtx.lineWidth = 2;
  diceCtx.beginPath();
  diceCtx.rect(-die.size / 2, -die.size / 2, die.size, die.size);
  diceCtx.fill();
  diceCtx.stroke();
  diceCtx.strokeStyle = '#60a5fa';
  diceCtx.beginPath();
  diceCtx.moveTo(die.size / 2, -die.size / 2);
  diceCtx.lineTo(die.size / 2 + 5, -die.size / 2 - 5);
  diceCtx.lineTo(die.size / 2 + 5, die.size / 2 - 5);
  diceCtx.lineTo(die.size / 2, die.size / 2);
  diceCtx.stroke();
  if (isStopped) {
    diceCtx.fillStyle = '#ef4444';
    diceCtx.font = 'bold 16px Courier New';
    diceCtx.textAlign = 'center';
    diceCtx.textBaseline = 'middle';
    diceCtx.fillText(die.face, 0, 0);
  }
  diceCtx.restore();
}

function updateDicePhysics(timestamp) {
  const elapsed = (timestamp - animationStart) / 1000;
  diceCtx.fillStyle = 'rgba(17, 24, 39, 0.9)';
  diceCtx.fillRect(0, 0, diceCanvas.width, diceCanvas.height);

  const isRolling = elapsed < 2;
  dice.forEach(die => {
    if (isRolling) {
      die.x += die.vx;
      die.y += die.vy;
      die.angle += die.angularV;
      if (die.x - die.size / 2 < tray.left || die.x + die.size / 2 > tray.right) {
        die.vx = -die.vx * 0.8;
        die.x = Math.max(tray.left + die.size / 2, Math.min(tray.right - die.size / 2, die.x));
      }
      if (die.y - die.size / 2 < tray.top || die.y + die.size / 2 > tray.bottom) {
        die.vy = -die.vy * 0.8;
        die.y = Math.max(tray.top + die.size / 2, Math.min(tray.bottom - die.size / 2, die.y));
      }
      die.vx *= 0.98;
      die.vy *= 0.98;
      die.angularV *= 0.98;
    } else {
      die.vx = 0;
      die.vy = 0;
      die.angularV = 0;
    }
    drawDie(die, !isRolling);
  });

  return isRolling;
}

function showDiceAnimation(socRoll, supportRoll, choice, scenario, callback) {
  try {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    diceResult.classList.add('hidden');
    clearDiceCanvas();

    dice[0].face = socRoll;
    dice[0].x = 50;
    dice[0].y = 50;
    dice[0].vx = 5;
    dice[0].vy = 3;
    dice[0].angle = 0;
    dice[0].angularV = 0.1;
    dice[1].face = supportRoll;
    dice[1].x = 100;
    dice[1].y = 50;
    dice[1].vx = -4;
    dice[1].vy = 4;
    dice[1].angle = 0;
    dice[1].angularV = -0.15;
    tray = { left: 10, right: diceCanvas.width - 10, top: 10, bottom: diceCanvas.height - 10 };

    const socOutcome = getDiceOutcome(gameState.socDice, socRoll);
    const supportOutcome = gameState.supportDice ? getDiceOutcome(gameState.supportDice, supportRoll) : "No Support Dice";
    const isSuccess = gameState.successfulDice.includes(choice.successCriteria);

    animationStart = performance.now();
    function animate(timestamp) {
      try {
        const isRolling = updateDicePhysics(timestamp);
        if (!isRolling) {
          const resultText = isSuccess
            ? `Success! SOC: ${socOutcome}<br>Support: ${supportOutcome}`
            : `No Match! SOC: ${socOutcome}<br>Support: ${supportOutcome}`;
          diceResult.innerHTML = resultText;
          diceResult.classList.remove('hidden');
          setTimeout(() => {
            diceResult.classList.add('hidden');
            clearDiceCanvas();
            animationFrameId = null;
            updateNotes(choice, scenario, isSuccess, socOutcome, supportOutcome);
            callback();
          }, 1500);
          return;
        }
        animationFrameId = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Animation error:', error);
        diceResult.classList.add('hidden');
        clearDiceCanvas();
        animationFrameId = null;
        updateNotes(choice, scenario, false, "", "");
        callback();
      }
    }
    animationFrameId = requestAnimationFrame(animate);
  } catch (error) {
    console.error('showDiceAnimation error:', error);
    diceResult.classList.add('hidden');
    clearDiceCanvas();
    gameState.isRolling = false;
    updateNotes(choice, scenario, false, "", "");
    callback();
  }
}

// Path visualization on canvas
const canvas = document.getElementById('grid-canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = 300;

function drawGridBackground() {
  ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  for (let x = 0; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.2;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawPath(scenario, successfulChoices, currentChoiceId, focusNodeId) {
  drawGridBackground();
  if (!scenario) return;

  const nodeWidth = 20;
  const levelHeight = 80;
  const startX = canvas.width / 2;
  const startY = 60;
  let nodes = [];

  if (!focusNodeId) {
    scenario.choices.forEach((choice, index) => {
      const level = 1;
      const x = startX + (index - (scenario.choices.length - 1) / 2) * 100;
      const y = startY + level * levelHeight;
      nodes.push({ id: choice.id, x, y, text: choice.text, next: choice.next || [], level });
    });
  } else {
    const focusChoice = scenario.choices.find(choice => choice.id === focusNodeId) ||
                       scenario.choices.flatMap(choice => choice.next || []).find(choice => choice.id === focusNodeId);
    if (focusChoice) {
      const x = startX;
      const y = startY;
      nodes.push({ id: focusChoice.id, x, y, text: focusChoice.text, next: focusChoice.next || [], level: 1 });
      if (focusChoice.next) {
        focusChoice.next.forEach((nextChoice, nextIndex) => {
          const nextX = startX + (nextIndex - (focusChoice.next.length - 1) / 2) * 80;
          const nextY = y + levelHeight;
          nodes.push({ id: nextChoice.id, x: nextX, y: nextY, text: nextChoice.text, next: [], level: 2 });
        });
      }
    }
  }

  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;
  nodes.forEach(node => {
    if (node.next) {
      node.next.forEach(nextChoice => {
        const nextNode = nodes.find(n => n.id === nextChoice.id);
        if (nextNode) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y + 10);
          ctx.lineTo(nextNode.x, nextNode.y - 10);
          ctx.stroke();
        }
      });
    }
  });

  nodes.forEach(node => {
    ctx.fillStyle = successfulChoices.includes(node.id) ? '#22c55e' : currentChoiceId === node.id ? '#93c5fd' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.stroke();

    ctx.fillStyle = '#60a5fa';
    ctx.font = '10px Courier New';
    ctx.textAlign = 'center';
    const words = node.text.split(' ');
    let line = '';
    let lines = [];
    for (let word of words) {
      if (ctx.measureText(line + word).width < 80) {
        line += word + ' ';
      } else {
        lines.push(line.trim());
        line = word + ' ';
      }
    }
    lines.push(line.trim());
    lines.forEach((line, index) => {
      ctx.fillText(line, node.x, node.y + 20 + index * 12);
    });
  });
}