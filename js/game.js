import { playCountdownSound } from './sounds.js';
import { showScreen } from './screens.js';
import { changeActiveBonusCircle } from './level.js';
import { renderFieldsWithPanes } from './render.js';
import { answerHandler } from './answerHandlers.js';
import { uiElements } from './ui-elements.js';
import { gameState } from './gameState.js';

function showCountdown() {
    //начинает отсчет перед игрой со звуками
    showScreen('countdown-screen');
    let countdownInner = document.getElementById('countdown-inner');
    let timerId = setInterval(() => {
        playCountdownSound();
        countdownInner.innerHTML -= 1;
    }, 1000);
    setTimeout(() => {
        renderFieldsWithPanes(gameState.levelDifficulty, uiElements, gameState);
        showScreen('game-screen');
        clearInterval(timerId);
        gameState.gameTimerId = setInterval(() => updateTimer(), 1000);
    }, 3000); // запускаем таймер до окончания
}
function updateTimer() {
    if (!+SECONDS.textContent && !+MINUTES.textContent) {
        return;
    }
    if (!+SECONDS.textContent) {
        MINUTES.textContent = '0' + (+MINUTES.textContent - 1);
        SECONDS.textContent = '59';
    } else {
        if (+SECONDS.textContent <= 10) {
            SECONDS.textContent = '0' + (+SECONDS.textContent - 1);
        } else {
            SECONDS.textContent -= 1;
        }
    }
}

function resetTheGame() {
    document.getElementById('countdown-inner').innerHTML = 3; // таймер для отсчета после обучения
    MINUTES.textContent = '01';
    SECONDS.textContent = '30';
    LEVEL_DESCRIPTION.textContent = '1-2';
    SCORE_COUNT_DESCRIPTION.textContent = '0';
    BONUS_COUNT.textContent = 'x1';
    gameState.bonusCount = 1;
    scoreCount = 0;
    gameState.countOfCorrectAnswer = 0;
    totalCorrectAnswer = 0;
    totalAnswer = 0;
    levelDifficulty = 0;
    changeActiveBonusCircle(gameState.bonusCount);
    document.getElementById('field-grid-of-pane').innerHTML = '';
    document.getElementById('correct-number').innerHTML = '';
}

const START_GAME_BUTTON = document.getElementById('start-game-button');
const RESET_GAME_BUTTON = document.getElementById('reset-game-button');
const TUTORIAL_SCREEN = document.getElementById('tutorial-screen');
const GAME_SCREEN = document.getElementById('game-screen');
const TASK_LARGE_PANE = document.getElementById('task-large-pane');
const LEVEL_DESCRIPTION = document.getElementById('level');
const BONUS_COUNT = document.getElementById('bonus-count');
const SCORE_COUNT_DESCRIPTION = document.getElementById('score');
const MINUTES = document.getElementById('minutes');
const SECONDS = document.getElementById('seconds');
const SCORE_RESULTS = document.getElementById('score-result');
const TOTAL_CORRECT_ANSWER_RESULTS = document.getElementById(
    'total-correct-answer-result',
);
const PERCENTAGE_OF_CORRECT_ANSWER_RESULTS = document.getElementById(
    'percentage-of-correct-answer-result',
);
const CORRECT_ANSWER_PNG = document.getElementById('correct-png');
const WRONG_ANSWER_PNG = document.getElementById('wrong-png');
const COLORS = ['orange', 'red', 'green', 'blue', 'purple'];
const ANIMATIONS = ['rotate', 'scale', 'flashing'];
let scoreCount = 0;
let totalCorrectAnswer = 0;
let totalAnswer = 0;
let levelDifficulty = 0;

START_GAME_BUTTON.addEventListener('click', () =>
    showScreen('tutorial-screen'),
);
RESET_GAME_BUTTON.addEventListener('click', () => {
    resetTheGame();
    showScreen('start-screen');
});
TUTORIAL_SCREEN.addEventListener('click', (event) => {
    let correct = answerHandler(event.target);
    if (correct) {
        showCountdown();
    }
});
