import {
    playCountdownSound,
    playCorrectSound,
    playWrongSound,
} from './sounds.js';

function showScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach((screen) => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
}

function showCountdown() {
    showScreen('countdown-screen');
    let countdownInner = document.getElementById('countdown-inner');
    let timerId = setInterval(() => {
        playCountdownSound();
        countdownInner.innerHTML -= 1;
    }, 1000);
    setTimeout(() => {
        showScreen('game-screen');
        clearInterval(timerId);
    }, 3000);
}

function answerHandler(target) {
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

function correctAnswerHandler(target) {
    playCorrectSound();
    if (target.classList.contains('tutorial')) {
        return;
    }
    CORRECT_ANSWER_PNG.style.display = 'block';
    setTimeout(() => {
        CORRECT_ANSWER_PNG.style.display = 'none';
    }, 500);
    if (target.classList.contains('tutorial')) {
        return;
    }
    countOfCorrectAnswer++;
}

function wrongAnswerHandler(target) {
    playWrongSound();
    WRONG_ANSWER_PNG.style.display = 'block';
    setTimeout(() => {
        WRONG_ANSWER_PNG.style.display = 'none';
    }, 500);
    if (target.classList.contains('tutorial')) {
        return;
    }
    countOfCorrectAnswer--;
}

const START_GAME_BUTTON = document.getElementById('start-game-button');
const TUTORIAL_SCREEN = document.getElementById('tutorial-screen');
const CORRECT_ANSWER_PNG = document.getElementById('correct-png');
const WRONG_ANSWER_PNG = document.getElementById('wrong-png');
let countOfCorrectAnswer = 0;
let levelDifficult = 0;

START_GAME_BUTTON.addEventListener('click', () =>
    showScreen('tutorial-screen'),
);
TUTORIAL_SCREEN.addEventListener('click', (event) => {
    let correct = answerHandler(event.target);
    if (correct) {
        showCountdown();
    }
});
