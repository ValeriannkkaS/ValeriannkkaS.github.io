export function randomizeColor() {
    //выдает плитке случайный цвет
    const x = Math.floor(Math.random() * 5);
    return COLORS[x];
}
export function randomizeAnimations() {
    //выдает случайную анимацию
    const x = Math.floor(Math.random() * 3);
    return ANIMATIONS[x];
}
export function randomizeNumber(levelDifficulty) {
    //выдает плитке случайное число
    let coeff;
    switch (levelDifficulty) {
        case 0:
            coeff = 100;
            break;
        case 1:
            coeff = 1000;
            break;
        default:
            coeff = 10000;
            break;
    }
    return Math.floor(Math.random() * coeff);
}

const COLORS = ['orange', 'red', 'green', 'blue', 'purple'];
const ANIMATIONS = ['rotate', 'scale', 'flashing'];
