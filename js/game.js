import {
    playCountdownSound,
    playCorrectSound,
    playWrongSound,
} from './sounds.js';

function showScreen(screenId) {
    //показ экранов (обучение/игра и т.д.)
    document.querySelectorAll('.game-screen').forEach((screen) => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
}

function showCountdown() {
    //начинает отсчет перед игрой со звуками
    showScreen('countdown-screen');
    let countdownInner = document.getElementById('countdown-inner');
    let timerId = setInterval(() => {
        playCountdownSound();
        countdownInner.innerHTML -= 1;
    }, 1000);
    setTimeout(() => {
        renderFieldsWithPanes(levelDifficulty);
        showScreen('game-screen');
        clearInterval(timerId);
    }, 3000);
}
function answerHandler(target) {
    //обработчики кликов по плиткам
    if (!target.classList.contains('pane-background')) {
        return false;
    }
    if (target.classList.contains('correct')) {
        correctAnswerHandler(target);
        return true;
    }
    if (!target.classList.contains('correct')) {
        wrongAnswerHandler(target);
        return false;
    }
}
let isAnswerBeingProcessed = false;
function correctAnswerHandler(target) {
    playCorrectSound();
    if (target.classList.contains('tutorial') || isAnswerBeingProcessed) {
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
    if (countOfCorrectAnswer < 5) {
        countOfCorrectAnswer++;
    }
    changeLevelDifficulty(countOfCorrectAnswer);
    renderFieldsWithPanes(levelDifficulty);
    console.log(levelDifficulty);
}
function wrongAnswerHandler(target) {
    playWrongSound();
    WRONG_ANSWER_PNG.style.display = 'block';
    setTimeout(() => {
        WRONG_ANSWER_PNG.style.display = 'none';
        isAnswerBeingProcessed = false;
    }, 500);
    if (target.classList.contains('tutorial') || isAnswerBeingProcessed) {
        return;
    }
    isAnswerBeingProcessed = true;
    if (countOfCorrectAnswer !== 0) {
        countOfCorrectAnswer--;
    }
    changeLevelDifficulty(countOfCorrectAnswer);
    renderFieldsWithPanes(levelDifficulty);
    console.log(levelDifficulty);
}
function changeLevelDifficulty(countOfCorrectAnswer) {
    if (countOfCorrectAnswer === 0 || countOfCorrectAnswer === 1) {
        levelDifficulty = 0;
    }
    if (countOfCorrectAnswer === 2) {
        levelDifficulty = 1;
    }
    if (countOfCorrectAnswer === 3 || countOfCorrectAnswer === 4) {
        levelDifficulty = 2;
    }
    if (countOfCorrectAnswer === 5) {
        levelDifficulty = 3;
    }
}

function generatePane(levelDifficulty) {
    //рендер плиток (в зависимости от сложности уровня к ним (и числам внутри них) применяются либо не применяются анимации)
    const pane = document.createElement('div');
    pane.classList.add('pane-background');
    pane.classList.add(randomizeColor());

    const number = document.createElement('span');
    number.classList.add('pane-inner');
    number.textContent = randomizeNumber(levelDifficulty);

    pane.appendChild(number);

    if (levelDifficulty === 0) {
        return pane;
    }
    if (levelDifficulty === 1 || levelDifficulty === 2) {
        const x = Math.floor(Math.random() * 2);
        if (x) {
            pane.classList.add(randomizeAnimations());
        } else {
            number.classList.add(randomizeAnimations());
        }
        return pane;
    }
    if (levelDifficulty === 3) {
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
    switch (levelDifficulty) {
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

    FIELD_GRID_OF_PANE.innerHTML = '';
    FIELD_GRID_OF_PANE.className = 'field-grid-of-pane';
    let x;
    let panes = new DocumentFragment();
    switch (levelDifficulty) {
        case 0:
            FIELD_GRID_OF_PANE.classList.add('easy');
            for (let i = 0; i < 6; i++) {
                panes.append(generatePane(levelDifficulty));
            }
            FIELD_GRID_OF_PANE.append(panes);
            x = 6;
            break;
        case 1:
            FIELD_GRID_OF_PANE.classList.add('normal');
            for (let i = 0; i < 9; i++) {
                panes.append(generatePane(levelDifficulty));
            }
            FIELD_GRID_OF_PANE.append(panes);
            x = 9;
            break;
        case 2:
            FIELD_GRID_OF_PANE.classList.add('hard');
            for (let i = 0; i < 16; i++) {
                panes.append(generatePane(levelDifficulty));
            }
            FIELD_GRID_OF_PANE.append(panes);
            x = 17;
            break;
        default:
            FIELD_GRID_OF_PANE.classList.add('extra-hard');
            for (let i = 0; i < 25; i++) {
                panes.append(generatePane(levelDifficulty));
            }
            FIELD_GRID_OF_PANE.append(panes);
            x = 26;
            break;
    }
    const gridPanes = FIELD_GRID_OF_PANE.querySelectorAll('.pane-background');
    let y = Math.floor(Math.random() * x);
    gridPanes[y].classList.add('correct');
    const number = gridPanes[y].firstElementChild.textContent;
    CORRECT_NUMBER_SPAN.textContent = number;
    FIELD_GRID_OF_PANE.addEventListener('click', (event) => {
        answerHandler(event.target);
    });
}

const START_GAME_BUTTON = document.getElementById('start-game-button');
const TUTORIAL_SCREEN = document.getElementById('tutorial-screen');
const GAME_CONTAINER = document.getElementById('game-container');
const GAME_SCREEN = document.getElementById('game-screen');
const FIELD_GRID_OF_PANE = document.getElementById('field-grid-of-pane');
const CORRECT_NUMBER_SPAN = document.getElementById('correct-number');
const TASK_LARGE_PANE = document.getElementById('task-large-pane');
const CORRECT_ANSWER_PNG = document.getElementById('correct-png');
const WRONG_ANSWER_PNG = document.getElementById('wrong-png');
const COLORS = ['orange', 'red', 'green', 'blue', 'purple'];
const ANIMATIONS = ['rotate', 'scale', 'flashing'];
let countOfCorrectAnswer = 0;
let levelDifficulty = 0;

START_GAME_BUTTON.addEventListener('click', () =>
    showScreen('tutorial-screen'),
);
TUTORIAL_SCREEN.addEventListener('click', (event) => {
    let correct = answerHandler(event.target);
    if (correct) {
        showCountdown();
    }
});
