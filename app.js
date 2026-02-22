const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const cycleCounterDisplay = document.getElementById('cycleCounter');
const workInput = document.getElementById('workMinutes');
const breakInput = document.getElementById('breakMinutes');
const cyclesInput = document.getElementById('cycles');
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');

let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let isRunning = false;
let isWorkPhase = true;
let intervalId = null;
let cycleCount = 0; // выполнено полных циклов

const workMinutes = () => Math.max(1, parseInt(workInput.value, 10) || 25);
const breakMinutes = () => Math.max(1, parseInt(breakInput.value, 10) || 5);
const targetCycles = () => Math.max(0, parseInt(cyclesInput.value, 10) || 0);

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateCycleDisplay() {
  const current = cycleCount + 1;
  cycleCounterDisplay.textContent = targetCycles() > 0
    ? `Цикл ${current} из ${targetCycles()}`
    : `Цикл ${current}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
  statusDisplay.textContent = isWorkPhase ? 'Работа' : 'Перерыв';
  statusDisplay.className = 'status ' + (isWorkPhase ? 'work' : 'break');
  updateCycleDisplay();
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  isWorkPhase = true;
  cycleCount = 0;
  totalSeconds = workMinutes() * 60;
  remainingSeconds = totalSeconds;
  updateDisplay();
  btnStart.disabled = false;
  btnStart.textContent = 'Старт';
  btnPause.disabled = true;
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  btnStart.disabled = false;
  btnStart.textContent = 'Старт';
  btnPause.disabled = true;
}

function switchPhase() {
  isWorkPhase = !isWorkPhase;
  totalSeconds = (isWorkPhase ? workMinutes() : breakMinutes()) * 60;
  remainingSeconds = totalSeconds;
  updateDisplay();
}

function tick() {
  remainingSeconds--;
  updateDisplay();
  if (remainingSeconds <= 0) {
    clearInterval(intervalId);
    intervalId = null;

    if (!isWorkPhase) {
      // Заканчивается перерыв — завершён полный цикл
      cycleCount++;
      const target = targetCycles();
      if (target > 0 && cycleCount >= target) {
        stopTimer();
        return;
      }
    }

    switchPhase();
    if (isRunning) {
      intervalId = setInterval(tick, 1000);
    }
  }
}

btnStart.addEventListener('click', () => {
  if (isRunning) return;
  if (!intervalId && remainingSeconds === totalSeconds && !isWorkPhase) {
    resetTimer();
  }
  isRunning = true;
  btnStart.disabled = true;
  btnStart.textContent = 'Старт';
  btnPause.disabled = false;
  intervalId = setInterval(tick, 1000);
});

btnPause.addEventListener('click', () => {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(intervalId);
  intervalId = null;
  btnStart.disabled = false;
  btnStart.textContent = 'Старт';
  btnPause.disabled = true;
});

btnReset.addEventListener('click', () => {
  resetTimer();
});

function clampInput(input, min, max) {
  const val = parseInt(input.value, 10);
  if (isNaN(val) || val < min) {
    input.value = min;
  } else if (val > max) {
    input.value = max;
  }
}

workInput.addEventListener('change', () => {
  clampInput(workInput, 1, 120);
  if (!isRunning && isWorkPhase) {
    totalSeconds = workMinutes() * 60;
    remainingSeconds = totalSeconds;
    updateDisplay();
  }
});

breakInput.addEventListener('change', () => {
  clampInput(breakInput, 1, 60);
  if (!isRunning && !isWorkPhase) {
    totalSeconds = breakMinutes() * 60;
    remainingSeconds = totalSeconds;
    updateDisplay();
  }
});

cyclesInput.addEventListener('change', () => {
  clampInput(cyclesInput, 0, 999);
  updateCycleDisplay();
});

// Initial display
updateDisplay();
