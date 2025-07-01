import { playCountdownSound } from './sounds.js';
import { showScreen } from './screens.js';
import { renderFieldsWithPanes, updateTimer } from './render.js';
import { answerHandler } from './answerHandlers.js';
import { resetTheGame } from './reset.js';
import { uiElements } from './ui-elements.js';
import { gameState } from './gameState.js';

function startTheGame() {
    //начинает отсчет перед игрой со звуками
    showScreen('countdown-screen');
    let countdownInner = document.getElementById('countdown-inner');
    let timerId = setInterval(() => {
        playCountdownSound();
        countdownInner.innerHTML -= 1;
    }, 1000);
    setTimeout(() => {
        renderFieldsWithPanes(gameState.levelDifficulty, uiElements, gameState); //рендерит первое поле с плитками, потом рендер через обработчики кликов
        showScreen('game-screen');
        clearInterval(timerId);
        gameState.gameTimerId = setInterval(
            () => updateTimer(uiElements.secondsSpan, uiElements.minutesSpan),
            1000,
        );
    }, 3000); // запускаем таймер до окончания
}

uiElements.startTutorialGameButton.addEventListener('click', () =>
    showScreen('tutorial-screen'),
);
uiElements.tutorialScreen.addEventListener('click', (event) => {
    let correct = answerHandler(event.target);
    if (correct) {
        startTheGame();
    }
});
uiElements.restartGameButton.addEventListener('click', () => {
    resetTheGame(gameState, uiElements);
    showScreen('start-screen');
});
