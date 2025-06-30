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
    if (!target.closest('.pane-background')) {
        return false;
    }
    if (target.closest('.pane-background').classList.contains('correct')) {
        correctAnswerHandler(target);
        return true;
    }
    if (!target.closest('.pane-background').classList.contains('correct')) {
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
    if (countOfCorrectAnswer < 5) {
        countOfCorrectAnswer++;
    }
    console.log(countOfCorrectAnswer);
    changeLevelDifficulty(countOfCorrectAnswer);
    renderFieldsWithPanes(levelDifficulty);
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
    if (countOfCorrectAnswer !== 0) {
        countOfCorrectAnswer--;
    }
    changeLevelDifficulty(countOfCorrectAnswer);
    renderFieldsWithPanes(levelDifficulty);
}
function changeLevelDifficulty(countOfCorrectAnswer) {
    if (countOfCorrectAnswer === 0 || countOfCorrectAnswer === 1) {
        bonusCount = 1;
        levelDifficulty = 0;
        LEVEL_DESCRIPTION.textContent = '1-4';
        BONUS_COUNT.textContent = 'x1';
        changeActiveBonusCircle(bonusCount);
    }
    if (countOfCorrectAnswer === 2) {
        bonusCount = 2;
        levelDifficulty = 1;
        LEVEL_DESCRIPTION.textContent = '2-4';
        BONUS_COUNT.textContent = 'x2';
        changeActiveBonusCircle(bonusCount);
    }
    if (countOfCorrectAnswer === 3 || countOfCorrectAnswer === 4) {
        bonusCount = 3;
        levelDifficulty = 2;
        LEVEL_DESCRIPTION.textContent = '3-4';
        BONUS_COUNT.textContent = 'x3';
        changeActiveBonusCircle(bonusCount);
    }
    if (countOfCorrectAnswer === 5) {
        bonusCount = 4;
        levelDifficulty = 3;
        LEVEL_DESCRIPTION.textContent = '4-4';
        BONUS_COUNT.textContent = 'x4';
        changeActiveBonusCircle(bonusCount);
    }
}
function changeActiveBonusCircle(bonusCount) {
    document.querySelectorAll('.bonus-circle').forEach((circle, index) => {
        circle.className = 'bonus-circle';
        if (++index < bonusCount) {
            circle.classList.add('active');
        }
    });
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

    const oldCorrectAnswer = document.getElementById('correct-number');
    const oldField = document.getElementById('field-grid-of-pane');
    if (oldField.classList.contains('start')) {
        oldField.remove();
        oldCorrectAnswer.remove();
    }

    const newField = document.createElement('div');
    newField.className = 'field-grid-of-pane slide-out-left';
    GAME_SCREEN.append(newField);

    let x;
    let panes = new DocumentFragment();
    switch (levelDifficulty) {
        case 0:
            newField.classList.add('easy');
            for (let i = 0; i < 6; i++) {
                panes.append(generatePane(levelDifficulty));
            }
            newField.append(panes);
            x = 6;
            break;
        case 1:
            newField.classList.add('normal');
            for (let i = 0; i < 9; i++) {
                panes.append(generatePane(levelDifficulty));
            }
            newField.append(panes);
            x = 9;
            break;
        case 2:
            newField.classList.add('hard');
            for (let i = 0; i < 16; i++) {
                panes.append(generatePane(levelDifficulty));
            }
            newField.append(panes);
            x = 17;
            break;
        default:
            newField.classList.add('extra-hard');
            for (let i = 0; i < 25; i++) {
                panes.append(generatePane(levelDifficulty));
            }
            newField.append(panes);
            x = 26;
            break;
    }

    const gridPanes = newField.querySelectorAll('.pane-background');
    let y = Math.floor(Math.random() * x);
    gridPanes[y].classList.add('correct');
    const number = gridPanes[y].firstElementChild.textContent;
    const newCorrectAnswer = document.createElement('span');
    newCorrectAnswer.classList.add('slide-out-left');
    newCorrectAnswer.textContent = number;
    TASK_LARGE_PANE.lastElementChild.append(newCorrectAnswer);

    newField.id = 'field-grid-of-pane';
    newCorrectAnswer.id = 'correct-number';

    requestAnimationFrame(() => {
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

const START_GAME_BUTTON = document.getElementById('start-game-button');
const TUTORIAL_SCREEN = document.getElementById('tutorial-screen');
const GAME_SCREEN = document.getElementById('game-screen');
const TASK_LARGE_PANE = document.getElementById('task-large-pane');
const LEVEL_DESCRIPTION = document.getElementById('level');
const BONUS_COUNT = document.getElementById('bonus-count');
const CORRECT_ANSWER_PNG = document.getElementById('correct-png');
const WRONG_ANSWER_PNG = document.getElementById('wrong-png');
const COLORS = ['orange', 'red', 'green', 'blue', 'purple'];
const ANIMATIONS = ['rotate', 'scale', 'flashing'];
let bonusCount = 1;
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
