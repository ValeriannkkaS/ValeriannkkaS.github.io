import {
    randomizeAnimations,
    randomizeColor,
    randomizeNumber,
} from './randomize.js';
import { answerHandler } from './answerHandlers.js';

export function renderFieldsWithPanes(levelDifficulty, uiElements, gameState) {
    const { gameScreenDiv, taskLargePaneDiv } = uiElements;

    gameScreenDiv.className = 'game-screen';
    taskLargePaneDiv.className = 'task-large-pane';
    const color = randomizeColor();
    gameScreenDiv.classList.add(color);
    taskLargePaneDiv.classList.add(color); //большая плитка с правильным ответом, всегда такого же цвета, как и поле

    const oldCorrectAnswer = document.getElementById('correct-number');
    const oldField = document.getElementById('field-grid-of-pane');
    if (oldField.classList.contains('start')) {
        oldField.remove();
        oldCorrectAnswer.remove();
    }

    const newField = document.createElement('div');
    newField.className = 'field-grid-of-pane slide-out-left';
    gameScreenDiv.append(newField);

    let panes = new DocumentFragment();

    const fieldConfigs = {
        0: { className: 'easy', count: 6 },
        1: { className: 'normal', count: 9 },
        2: { className: 'hard', count: 16 },
        3: { className: 'extra-hard', count: 25 },
    };
    const { className, count } = fieldConfigs[levelDifficulty];
    newField.classList.add(className);
    for (let i = 0; i < count; i++) {
        panes.append(generatePane(levelDifficulty));
    }
    newField.append(panes);

    const gridPanes = newField.querySelectorAll('.pane-background');
    let y = Math.floor(Math.random() * (count + 1)); // число для выбора правильной плитке на уровне
    gridPanes[y].classList.add('correct');
    const number = gridPanes[y].firstElementChild.textContent;
    const newCorrectAnswer = document.createElement('span');
    newCorrectAnswer.classList.add('slide-out-left');
    newCorrectAnswer.textContent = number;
    taskLargePaneDiv.lastElementChild.append(newCorrectAnswer);

    newField.id = 'field-grid-of-pane';
    newCorrectAnswer.id = 'correct-number';

    requestAnimationFrame(() => {
        //анимации появления
        oldField.classList.remove('active');
        oldField.classList.add('slide-in-right');
        newField.classList.remove('slide-out-left');
        newField.classList.add('active');

        oldCorrectAnswer.classList.remove('active');
        oldCorrectAnswer.classList.add('slide-in-right');
        newCorrectAnswer.classList.remove('slide-out-left');
        newCorrectAnswer.classList.add('active');
    });

    setTimeout(() => {
        oldField.remove();
        oldCorrectAnswer.remove();
    }, 200);

    newField.addEventListener('click', (event) =>
        answerHandler(event.target, uiElements, gameState),
    );
}

export function generatePane(levelDifficulty) {
    //рендер плиток (в зависимости от сложности уровня к ним (и числам внутри них) применяются либо не применяются анимации)
    const pane = document.createElement('div');
    pane.classList.add('pane-background');
    pane.classList.add(randomizeColor());

    const number = document.createElement('span');
    number.classList.add('pane-inner');
    number.textContent = randomizeNumber(levelDifficulty);

    pane.appendChild(number);

    if (levelDifficulty === 0) {
        return pane;
    }
    if (levelDifficulty === 1 || levelDifficulty === 2) {
        const x = Math.floor(Math.random() * 2);
        if (x) {
            pane.classList.add(randomizeAnimations());
        } else {
            number.classList.add(randomizeAnimations());
        }
        return pane;
    }
    if (levelDifficulty === 3) {
        pane.classList.add(randomizeAnimations());
        number.classList.add(randomizeAnimations());
        return pane;
    }
}

export function renderResults(uiElements, gameState) {
    uiElements.scoreResultsSpan.textContent = gameState.scoreCount;
    uiElements.totalCorrectAnswerResultsSpan.textContent =
        gameState.totalCorrectAnswer + ' из ' + gameState.totalAnswer;
    uiElements.percentageOfCorrectAnswerResultsSpan.textContent =
        ((gameState.totalCorrectAnswer / gameState.totalAnswer) * 100).toFixed(
            2,
        ) + '%';
}
