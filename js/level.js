const levels = [
    { min: 0, max: 1, bonus: 1, difficulty: 0, text: '1-4' },
    { min: 2, max: 2, bonus: 2, difficulty: 1, text: '2-4' },
    { min: 3, max: 4, bonus: 3, difficulty: 2, text: '3-4' },
    { min: 5, max: 5, bonus: 4, difficulty: 3, text: '4-4' },
];
export function changeLevelDifficulty(uiElements, gameState) {
    for (let level of levels) {
        if (
            gameState.countOfCorrectAnswer >= level.min &&
            gameState.countOfCorrectAnswer <= level.max
        ) {
            gameState.bonusCount = level.bonus;
            gameState.levelDifficulty = level.difficulty;
            uiElements.levelDescriptionSpan.textContent = level.text;
            uiElements.bonusCountSpan.textContent = 'x' + gameState.bonusCount;
            changeActiveBonusCircle(gameState.bonusCount);
            break;
        }
    }
}
export function changeActiveBonusCircle(bonusCount) {
    document.querySelectorAll('.bonus-circle').forEach((circle, index) => {
        circle.className = 'bonus-circle';
        if (++index < bonusCount) {
            circle.classList.add('active');
        }
    });
}
