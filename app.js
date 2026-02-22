const timerDisplay = document.getElementById('timer');
const statusDisplay = document.getElementById('status');
const workInput = document.getElementById('workMinutes');
const breakInput = document.getElementById('breakMinutes');
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');

let totalSeconds = 25 * 60;
let remainingSeconds = totalSeconds;
let isRunning = false;
let isWorkPhase = true;
let intervalId = null;

const workMinutes = () => parseInt(workInput.value, 10) || 25;
const breakMinutes = () => parseInt(breakInput.value, 10) || 5;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
  statusDisplay.textContent = isWorkPhase ? 'Работа' : 'Перерыв';
  statusDisplay.className = 'status ' + (isWorkPhase ? 'work' : 'break');
}

function resetTimer() {
  clearInterval(intervalId);
  intervalId = null;
  isRunning = false;
  isWorkPhase = true;
  totalSeconds = workMinutes() * 60;
  remainingSeconds = totalSeconds;
  updateDisplay();
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

workInput.addEventListener('change', () => {
  if (!isRunning && isWorkPhase) {
    totalSeconds = workMinutes() * 60;
    remainingSeconds = totalSeconds;
    updateDisplay();
  }
});

breakInput.addEventListener('change', () => {
  if (!isRunning && !isWorkPhase) {
    totalSeconds = breakMinutes() * 60;
    remainingSeconds = totalSeconds;
    updateDisplay();
  }
});

// Initial display
updateDisplay();
