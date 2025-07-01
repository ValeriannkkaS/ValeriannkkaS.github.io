import {
    playCountdownSound,
    playCorrectSound,
    playWrongSound,
} from './sounds.js';
import { showScreen } from './screens.js';
import { changeLevelDifficulty, changeActiveBonusCircle } from './level.js';
import { gameState } from './gameState.js';

let gameTimerId;
function showCountdown() {
    //начинает отсчет перед игрой со звуками
    showScreen('countdown-screen');
    let countdownInner = document.getElementById('countdown-inner');
    let timerId = setInterval(() => {
        playCountdownSound();
        countdownInner.innerHTML -= 1;
    }, 1000);
    setTimeout(() => {
        renderFieldsWithPanes(gameState.levelDifficulty);
        showScreen('game-screen');
        clearInterval(timerId);
        gameTimerId = setInterval(() => updateTimer(), 1000);
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
function answerHandler(target) {
    //обработчики кликов по плиткам
    const pane = target.closest('.pane-background');
    if (!pane) {
        return false;
    }
    if (pane.classList.contains('correct')) {
        correctAnswerHandler(target);
        return true;
    }
    if (!pane.classList.contains('correct')) {
        wrongAnswerHandler(target);
        return false;
    }
}

let isAnswerBeingProcessed = false;
function correctAnswerHandler(target) {
    playCorrectSound();
    if (
        target.closest('.pane-background').classList.contains('tutorial') ||
        isAnswerBeingProcessed
    ) {
        return;
    }
    isAnswerBeingProcessed = true;
    CORRECT_ANSWER_PNG.style.display = 'block';
    setTimeout(() => {
        CORRECT_ANSWER_PNG.style.display = 'none';
        isAnswerBeingProcessed = false;
    }, 500);
    if (target.classList.contains('tutorial')) {
        return;
    }
    if (gameState.countOfCorrectAnswer < 5) {
        gameState.countOfCorrectAnswer++;
    }
    totalAnswer++;
    totalCorrectAnswer++;
    scoreCount += 100 * gameState.bonusCount;
    SCORE_COUNT_DESCRIPTION.textContent = scoreCount;

    changeLevelDifficulty({
        levelDescriptionSpan: LEVEL_DESCRIPTION,
        bonusCountSpan: BONUS_COUNT,
    });
    renderFieldsWithPanes(gameState.levelDifficulty);
    checkGameEnd(+SECONDS.textContent, +MINUTES.textContent);
}
function wrongAnswerHandler(target) {
    playWrongSound();
    WRONG_ANSWER_PNG.style.display = 'block';
    setTimeout(() => {
        WRONG_ANSWER_PNG.style.display = 'none';
        isAnswerBeingProcessed = false;
    }, 500);
    if (
        target.closest('.pane-background').classList.contains('tutorial') ||
        isAnswerBeingProcessed
    ) {
        return;
    }
    isAnswerBeingProcessed = true;
    if (gameState.countOfCorrectAnswer !== 0) {
        gameState.countOfCorrectAnswer--;
    }
    totalAnswer++;
    changeLevelDifficulty({
        levelDescriptionSpan: LEVEL_DESCRIPTION,
        bonusCountSpan: BONUS_COUNT,
    });
    renderFieldsWithPanes(gameState.levelDifficulty);
    checkGameEnd(+SECONDS.textContent, +MINUTES.textContent);
}
function checkGameEnd(seconds, minutes) {
    if (!seconds && !minutes) {
        clearInterval(gameTimerId);
        renderResults();
        showScreen('end-screen');
        // завершаем игру и подсчитываем результаты
    }
}

function generatePane(levelDifficulty) {
    //рендер плиток (в зависимости от сложности уровня к ним (и числам внутри них) применяются либо не применяются анимации)
    const pane = document.createElement('div');
    pane.classList.add('pane-background');
    pane.classList.add(randomizeColor());

    const number = document.createElement('span');
    number.classList.add('pane-inner');
    number.textContent = randomizeNumber(gameState.levelDifficulty);

    pane.appendChild(number);

    if (gameState.levelDifficulty === 0) {
        return pane;
    }
    if (gameState.levelDifficulty === 1 || gameState.levelDifficulty === 2) {
        const x = Math.floor(Math.random() * 2);
        if (x) {
            pane.classList.add(randomizeAnimations());
        } else {
            number.classList.add(randomizeAnimations());
        }
        return pane;
    }
    if (gameState.levelDifficulty === 3) {
        pane.classList.add(randomizeAnimations());
        number.classList.add(randomizeAnimations());
        return pane;
    }
}
function randomizeColor() {
    //выдает плитке случайный цвет
    const x = Math.floor(Math.random() * 5);
    return COLORS[x];
}
function randomizeNumber(levelDifficulty) {
    //выдает плитке случайное число
    let coeff;
    switch (gameState.levelDifficulty) {
        case 0:
            coeff = 100;
            break;
        case 1:
            coeff = 1000;
            break;
        default:
            coeff = 10000;
            break;
    }
    return Math.floor(Math.random() * coeff);
}
function randomizeAnimations() {
    //выдает случайную анимацию
    const x = Math.floor(Math.random() * 3);
    return ANIMATIONS[x];
}

function renderFieldsWithPanes(levelDifficulty) {
    GAME_SCREEN.className = 'game-screen';
    TASK_LARGE_PANE.className = 'task-large-pane';
    const color = randomizeColor();
    GAME_SCREEN.classList.add(color);
    TASK_LARGE_PANE.classList.add(color); //большая плитка с правильным ответом, всегда такого же цвета, как и поле

    const oldCorrectAnswer = document.getElementById('correct-number');
    const oldField = document.getElementById('field-grid-of-pane');
    if (oldField.classList.contains('start')) {
        oldField.remove();
        oldCorrectAnswer.remove();
    }

    const newField = document.createElement('div');
    newField.className = 'field-grid-of-pane slide-out-left';
    GAME_SCREEN.append(newField);

    let panes = new DocumentFragment();

    const fieldConfigs = {
        0: { className: 'easy', count: 6 },
        1: { className: 'normal', count: 9 },
        2: { className: 'hard', count: 16 },
        3: { className: 'extra-hard', count: 25 },
    };
    const { className, count } = fieldConfigs[gameState.levelDifficulty];
    newField.classList.add(className);
    for (let i = 0; i < count; i++) {
        panes.append(generatePane(gameState.levelDifficulty));
    }
    newField.append(panes);

    const gridPanes = newField.querySelectorAll('.pane-background');
    let y = Math.floor(Math.random() * (count + 1)); // число для выбора правильной плитке на уровне
    gridPanes[y].classList.add('correct');
    const number = gridPanes[y].firstElementChild.textContent;
    const newCorrectAnswer = document.createElement('span');
    newCorrectAnswer.classList.add('slide-out-left');
    newCorrectAnswer.textContent = number;
    TASK_LARGE_PANE.lastElementChild.append(newCorrectAnswer);

    newField.id = 'field-grid-of-pane';
    newCorrectAnswer.id = 'correct-number';

    requestAnimationFrame(() => {
        //анимации появления
        oldField.classList.remove('active');
        oldField.classList.add('slide-in-right');
        newField.classList.remove('slide-out-left');
        newField.classList.add('active');

        oldCorrectAnswer.classList.remove('active');
        oldCorrectAnswer.classList.add('slide-in-right');
        newCorrectAnswer.classList.remove('slide-out-left');
        newCorrectAnswer.classList.add('active');
    });

    setTimeout(() => {
        oldField.remove();
        oldCorrectAnswer.remove();
    }, 200);

    newField.addEventListener('click', (event) => answerHandler(event.target));
}

function renderResults() {
    SCORE_RESULTS.textContent = scoreCount;
    TOTAL_CORRECT_ANSWER_RESULTS.textContent =
        totalCorrectAnswer + 'из' + totalAnswer;
    PERCENTAGE_OF_CORRECT_ANSWER_RESULTS.textContent =
        ((totalCorrectAnswer / totalAnswer) * 100).toFixed(2) + '%';
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
