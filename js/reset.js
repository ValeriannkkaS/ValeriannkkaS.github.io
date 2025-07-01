import { changeActiveBonusCircle } from './level.js';

export function resetTheGame(gameState, uiElements) {
    document.getElementById('countdown-inner').innerHTML = 3; // таймер для отсчета после обучения
    uiElements.minutesSpan.textContent = '01';
    uiElements.secondsSpan.textContent = '30';
    uiElements.levelDescriptionSpan.textContent = '1-2';
    uiElements.scoreCountSpan.textContent = '0';
    uiElements.bonusCountSpan.textContent = 'x1';
    gameState.bonusCount = 1;
    gameState.scoreCount = 0;
    gameState.countOfCorrectAnswer = 0;
    gameState.totalCorrectAnswer = 0;
    gameState.totalAnswer = 0;
    gameState.levelDifficulty = 0;
    changeActiveBonusCircle(gameState.bonusCount);
    document.getElementById('field-grid-of-pane').innerHTML = '';
    document.getElementById('correct-number').innerHTML = '';
    //очищаем старые поля
}
