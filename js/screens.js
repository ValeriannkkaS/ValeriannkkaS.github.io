export function showScreen(screenId) {
    //показ экранов (обучение/игра и т.д.)
    document.querySelectorAll('.game-screen').forEach((screen) => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'block';
}
