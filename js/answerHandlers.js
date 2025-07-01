import { playCorrectSound, playWrongSound } from './sounds.js';
import { changeLevelDifficulty } from './level.js';
import { renderFieldsWithPanes, renderResults } from './render.js';
import { showScreen } from './screens.js';

export function answerHandler(target, uiElements, gameState) {
    //обработчики кликов по плиткам
    const pane = target.closest('.pane-background');
    if (!pane) {
        return false;
    }
    if (pane.classList.contains('correct')) {
        correctAnswerHandler(target, uiElements, gameState);
        return true;
    }
    if (!pane.classList.contains('correct')) {
        wrongAnswerHandler(target, uiElements, gameState);
        return false;
    }
}
let isAnswerBeingProcessed = false;
export function correctAnswerHandler(target, uiElements, gameState) {
    playCorrectSound();
    if (
        target.closest('.pane-background').classList.contains('tutorial') ||
        isAnswerBeingProcessed
    ) {
        return;
    }
    isAnswerBeingProcessed = true;
    uiElements.correctAnswerImage.style.display = 'block';
    setTimeout(() => {
        uiElements.correctAnswerImage.style.display = 'none';
        isAnswerBeingProcessed = false;
    }, 500);
    if (target.classList.contains('tutorial')) {
        return;
    }
    if (gameState.countOfCorrectAnswer < 5) {
        gameState.countOfCorrectAnswer++;
    }
    gameState.totalAnswer++;
    gameState.totalCorrectAnswer++;
    gameState.scoreCount += 100 * gameState.bonusCount;
    uiElements.scoreCountSpan.textContent = gameState.scoreCount;

    changeLevelDifficulty(uiElements, gameState);
    renderFieldsWithPanes(gameState.levelDifficulty, uiElements, gameState);
    checkGameEnd(
        +uiElements.secondsSpan.textContent,
        +uiElements.minutesSpan.textContent,
        gameState,
        uiElements,
    );
}
export function wrongAnswerHandler(target, uiElements, gameState) {
    playWrongSound();
    uiElements.wrongAnswerImage.style.display = 'block';
    setTimeout(() => {
        uiElements.wrongAnswerImage.style.display = 'none';
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
    gameState.totalAnswer++;
    changeLevelDifficulty(uiElements, gameState);
    renderFieldsWithPanes(gameState.levelDifficulty, uiElements, gameState);
    checkGameEnd(
        +uiElements.secondsSpan.textContent,
        +uiElements.minutesSpan.textContent,
        gameState,
        uiElements,
    );
}
function checkGameEnd(seconds, minutes, gameState, uiElements) {
    if (!seconds && !minutes) {
        clearInterval(gameState.gameTimerId);
        renderResults(uiElements, gameState);
        showScreen('end-screen');
        // завершаем игру и подсчитываем результаты
    }
}
