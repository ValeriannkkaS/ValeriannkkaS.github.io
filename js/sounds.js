const countdownSound = new Audio(
    'public/sounds/mixkit-modern-technology-select-3124.wav',
);

export default function playCountdownSound() {
    countdownSound.currentTime = 0;
    countdownSound.play();
}
