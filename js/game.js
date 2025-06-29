import playCountdownSound from './sounds.js';

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

const START_GAME_BUTTON = document.getElementById('start-game-button');
const TUTORIAL_SCREEN = document.getElementById('tutorial-screen');

START_GAME_BUTTON.addEventListener('click', () =>
    showScreen('tutorial-screen'),
);
TUTORIAL_SCREEN.addEventListener('click', () => {
    showCountdown();
});
