const countdownSound = new Audio(
    'public/sounds/mixkit-modern-technology-select-3124.wav',
);
const correctSound = new Audio('public/sounds/correct-choice-43861.mp3');
const wrongSound = new Audio('public/sounds/wrong-47985.mp3');

export function playCountdownSound() {
    countdownSound.currentTime = 0;
    countdownSound.play();
}
export function playCorrectSound() {
    correctSound.currentTime = 0;
    correctSound.play();
}
export function playWrongSound() {
    wrongSound.currentTime = 0;
    wrongSound.play();
}
