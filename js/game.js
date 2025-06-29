function showScreen(screenId) {
    document.querySelectorAll('.game-screen').forEach((screen) => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
}

const START_GAME_BUTTON = document.getElementById('start-game-button');
START_GAME_BUTTON.addEventListener('click', () =>
    showScreen('tutorial-screen'),
);
