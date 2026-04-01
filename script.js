let currentGame = '';
let score = 0;
let currentAnswer = 0;
let level = 1;
let correctAnswers = 0;
let answersNeeded = 5;
let gameData = {};

const sequences = [
    [2, 4, 6, 8], [1, 3, 5, 7], [5, 10, 15, 20], [1, 4, 9, 16],
    [2, 6, 18, 54], [1, 1, 2, 3], [10, 20, 30, 40]
];

function startGame(gameType) {
    currentGame = gameType;
    score = 0;
    level = 1;
    correctAnswers = 0;
    answersNeeded = 5;
    gameData = {};
    
    hideAllGameTypes();
    updateDisplay();
    document.querySelector('.game-selector').style.display = 'none';
    document.getElementById('game-area').classList.remove('hidden');
    
    switch(gameType) {
        case 'memory':
            document.getElementById('memory-game').classList.remove('hidden');
            break;
        case 'sequence':
            document.getElementById('sequence-game').classList.remove('hidden');
            break;
        case 'equation':
        case 'pattern':
        case 'logic':
        case 'algebra':
            document.getElementById('puzzle-game').classList.remove('hidden');
            break;
        default:
            document.getElementById('math-question').classList.remove('hidden');
    }
    
    nextQuestion();
}

function hideAllGameTypes() {
    document.querySelectorAll('.question-type').forEach(el => el.classList.add('hidden'));
}

function updateDisplay() {
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    document.getElementById('progress-text').textContent = `${correctAnswers}/${answersNeeded}`;
    const progressPercent = (correctAnswers / answersNeeded) * 100;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
}

function levelUp() {
    level++;
    correctAnswers = 0;
    answersNeeded = Math.min(5 + level, 10);
    updateDisplay();
    
    const feedback = document.getElementById('feedback');
    feedback.textContent = `🎉 Level Up! Now Level ${level}`;
    feedback.style.color = '#FFD700';
    
    setTimeout(() => {
        feedback.textContent = '';
    }, 2000);
}

function generateQuestion() {
    switch(currentGame) {
        case 'addition':
        case 'subtraction':
        case 'multiplication':
        case 'division':
            generateMathQuestion();
            break;
        case 'memory':
            generateMemoryGame();
            break;
        case 'sequence':
            generateSequence();
            break;
        case 'equation':
            generateMissingNumber();
            break;
        case 'pattern':
            generateNumberPattern();
            break;
        case 'logic':
            generateLogicPuzzle();
            break;
        case 'algebra':
            generateAlgebra();
            break;
    }
}

function generateMathQuestion() {
    let num1, num2, question;
    const difficulty = Math.min(level, 10);
    
    switch(currentGame) {
        case 'addition':
            const addMax = 20 + (difficulty * 10);
            num1 = Math.floor(Math.random() * addMax) + 1;
            num2 = Math.floor(Math.random() * addMax) + 1;
            currentAnswer = num1 + num2;
            question = `${num1} + ${num2} = ?`;
            break;
        case 'subtraction':
            const subMax = 25 + (difficulty * 15);
            num1 = Math.floor(Math.random() * subMax) + (difficulty * 5);
            num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
            currentAnswer = num1 - num2;
            question = `${num1} - ${num2} = ?`;
            break;
        case 'multiplication':
            const multMax = Math.min(5 + difficulty, 15);
            num1 = Math.floor(Math.random() * multMax) + 1;
            num2 = Math.floor(Math.random() * multMax) + 1;
            currentAnswer = num1 * num2;
            question = `${num1} × ${num2} = ?`;
            break;
        case 'division':
            const divMax = Math.min(5 + difficulty, 12);
            num2 = Math.floor(Math.random() * divMax) + 1;
            currentAnswer = Math.floor(Math.random() * divMax) + 1;
            num1 = num2 * currentAnswer;
            question = `${num1} ÷ ${num2} = ?`;
            break;
    }
    
    document.getElementById('question').textContent = question;
}

function generateMemoryGame() {
    const symbols = ['🎵', '🌟', '🎨', '🚀', '🎯', '🎪', '🎭', '🎸'];
    gameData.cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    gameData.flipped = [];
    gameData.matched = [];
    
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    
    gameData.cards.forEach((symbol, index) => {
        const card = document.createElement('button');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.onclick = () => flipCard(index);
        grid.appendChild(card);
    });
}

function generateSequence() {
    const sequence = sequences[Math.floor(Math.random() * sequences.length)];
    gameData.sequence = sequence;
    currentAnswer = getNextInSequence(sequence);
    
    document.getElementById('sequence-display').textContent = 
        `Find the next number: ${sequence.join(', ')}, ?`;
}

function getNextInSequence(seq) {
    const diff = seq[1] - seq[0];
    if(seq.every((n, i) => i === 0 || n - seq[i-1] === diff)) {
        return seq[seq.length - 1] + diff;
    }
    const ratio = seq[1] / seq[0];
    if(seq.every((n, i) => i === 0 || n / seq[i-1] === ratio)) {
        return seq[seq.length - 1] * ratio;
    }
    return seq[seq.length - 1] + seq[seq.length - 2];
}

function generateMissingNumber() {
    const difficulty = Math.min(level, 5);
    const operations = ['+', '-', '×', '÷'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let a, b, result;
    switch(op) {
        case '+':
            a = Math.floor(Math.random() * (10 + difficulty * 5)) + 1;
            b = Math.floor(Math.random() * (10 + difficulty * 5)) + 1;
            result = a + b;
            break;
        case '-':
            result = Math.floor(Math.random() * (10 + difficulty * 5)) + 1;
            b = Math.floor(Math.random() * result) + 1;
            a = result + b;
            break;
        case '×':
            a = Math.floor(Math.random() * (5 + difficulty)) + 1;
            b = Math.floor(Math.random() * (5 + difficulty)) + 1;
            result = a * b;
            break;
        case '÷':
            b = Math.floor(Math.random() * (5 + difficulty)) + 1;
            result = Math.floor(Math.random() * (5 + difficulty)) + 1;
            a = b * result;
            break;
    }
    
    const missing = Math.floor(Math.random() * 3);
    let puzzle, answer;
    
    switch(missing) {
        case 0:
            puzzle = `? ${op} ${b} = ${result}`;
            answer = a;
            break;
        case 1:
            puzzle = `${a} ${op} ? = ${result}`;
            answer = b;
            break;
        case 2:
            puzzle = `${a} ${op} ${b} = ?`;
            answer = result;
            break;
    }
    
    currentAnswer = answer;
    document.getElementById('puzzle-display').textContent = puzzle;
    document.getElementById('puzzle-hint').textContent = 'Find the missing number';
}

function generateNumberPattern() {
    const difficulty = Math.min(level, 5);
    const patterns = [
        // Arithmetic sequences
        () => {
            const start = Math.floor(Math.random() * 10) + 1;
            const diff = Math.floor(Math.random() * (3 + difficulty)) + 1;
            const seq = [start, start + diff, start + 2*diff, start + 3*diff];
            return { seq, answer: start + 4*diff, hint: `Add ${diff} each time` };
        },
        // Geometric sequences
        () => {
            const start = Math.floor(Math.random() * 5) + 1;
            const ratio = 2 + Math.floor(Math.random() * 2);
            const seq = [start, start * ratio, start * ratio * ratio, start * ratio * ratio * ratio];
            return { seq, answer: start * Math.pow(ratio, 4), hint: `Multiply by ${ratio} each time` };
        },
        // Square numbers
        () => {
            const start = 1 + Math.floor(Math.random() * 3);
            const seq = [start*start, (start+1)*(start+1), (start+2)*(start+2), (start+3)*(start+3)];
            return { seq, answer: (start+4)*(start+4), hint: 'Perfect squares' };
        },
        // Add/multiply alternating
        () => {
            const start = Math.floor(Math.random() * 5) + 2;
            const add = Math.floor(Math.random() * 3) + 1;
            const mult = 2;
            const seq = [start, start + add, (start + add) * mult, (start + add) * mult + add];
            return { seq, answer: ((start + add) * mult + add) * mult, hint: `Add ${add}, then multiply by ${mult}` };
        }
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)]();
    currentAnswer = pattern.answer;
    
    document.getElementById('puzzle-display').textContent = 
        `${pattern.seq.join(', ')}, ?`;
    document.getElementById('puzzle-hint').textContent = pattern.hint;
}

function generateLogicPuzzle() {
    const difficulty = Math.min(level, 5);
    const puzzles = [
        () => {
            const age = Math.floor(Math.random() * 20) + 10;
            const years = Math.floor(Math.random() * 10) + 5;
            return {
                puzzle: `I am ${age} years old. In ${years} years, how old will I be?`,
                answer: age + years,
                hint: 'Add the years to current age'
            };
        },
        () => {
            const total = Math.floor(Math.random() * 20) + 10;
            const given = Math.floor(Math.random() * (total - 1)) + 1;
            return {
                puzzle: `I have ${total} apples. I give away ${given} apples. How many do I have left?`,
                answer: total - given,
                hint: 'Subtract what was given away'
            };
        },
        () => {
            const price = Math.floor(Math.random() * 10) + 2;
            const items = Math.floor(Math.random() * 5) + 2;
            return {
                puzzle: `Each candy costs $${price}. How much do ${items} candies cost?`,
                answer: price * items,
                hint: 'Multiply price by quantity'
            };
        },
        () => {
            const total = Math.floor(Math.random() * 30) + 20;
            const groups = Math.floor(Math.random() * 4) + 2;
            const perGroup = Math.floor(total / groups);
            return {
                puzzle: `${total} students are divided into ${groups} equal groups. How many students per group?`,
                answer: perGroup,
                hint: 'Divide total by number of groups'
            };
        }
    ];
    
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)]();
    currentAnswer = puzzle.answer;
    
    document.getElementById('puzzle-display').textContent = puzzle.puzzle;
    document.getElementById('puzzle-hint').textContent = puzzle.hint;
}

function generateAlgebra() {
    const difficulty = Math.min(level, 5);
    const x = Math.floor(Math.random() * 10) + 1;
    const operations = [
        () => {
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            return {
                equation: `x + ${a} = ${x + a}`,
                answer: x,
                hint: `Subtract ${a} from both sides`
            };
        },
        () => {
            const a = Math.floor(Math.random() * 5) + 1;
            return {
                equation: `x - ${a} = ${x - a}`,
                answer: x,
                hint: `Add ${a} to both sides`
            };
        },
        () => {
            const a = Math.floor(Math.random() * 4) + 2;
            return {
                equation: `${a}x = ${a * x}`,
                answer: x,
                hint: `Divide both sides by ${a}`
            };
        },
        () => {
            const a = Math.floor(Math.random() * 4) + 2;
            const b = Math.floor(Math.random() * 10) + 1;
            return {
                equation: `${a}x + ${b} = ${a * x + b}`,
                answer: x,
                hint: `Subtract ${b}, then divide by ${a}`
            };
        }
    ];
    
    const algebra = operations[Math.floor(Math.random() * operations.length)]();
    currentAnswer = algebra.answer;
    
    document.getElementById('puzzle-display').textContent = 
        `Solve for x: ${algebra.equation}`;
    document.getElementById('puzzle-hint').textContent = algebra.hint;
}

function checkAnswer() {
    const feedback = document.getElementById('feedback');
    let isCorrect = false;
    
    switch(currentGame) {
        case 'addition':
        case 'subtraction':
        case 'multiplication':
        case 'division':
            const mathAnswer = parseInt(document.getElementById('answer').value);
            isCorrect = mathAnswer === currentAnswer;
            break;
        case 'sequence':
            const seqAnswer = parseInt(document.getElementById('sequence-input').value);
            isCorrect = seqAnswer === currentAnswer;
            break;
        case 'equation':
        case 'pattern':
        case 'logic':
        case 'algebra':
            const puzzleAnswer = parseInt(document.getElementById('puzzle-input').value);
            isCorrect = puzzleAnswer === currentAnswer;
            break;
        case 'memory':
            return; // Memory game handles scoring differently
    }
    
    if (isCorrect) {
        feedback.textContent = '✓ Correct!';
        feedback.style.color = '#4CAF50';
        score++;
        correctAnswers++;
        
        if (correctAnswers >= answersNeeded) {
            levelUp();
        } else {
            updateDisplay();
        }
    } else {
        feedback.textContent = `✗ Wrong! ${getCorrectAnswerText()}`;
        feedback.style.color = '#FF6B6B';
    }
}

function getCorrectAnswerText() {
    switch(currentGame) {
        case 'sequence':
            return `The answer is ${currentAnswer}`;
        default:
            return `The answer is ${currentAnswer}`;
    }
}

function flipCard(index) {
    if(gameData.flipped.length === 2 || gameData.flipped.includes(index) || gameData.matched.includes(index)) return;
    
    const card = document.querySelector(`[data-index="${index}"]`);
    card.textContent = gameData.cards[index];
    card.classList.add('flipped');
    gameData.flipped.push(index);
    
    if(gameData.flipped.length === 2) {
        setTimeout(() => {
            const [first, second] = gameData.flipped;
            if(gameData.cards[first] === gameData.cards[second]) {
                gameData.matched.push(first, second);
                score++;
                correctAnswers++;
                if(gameData.matched.length === 16) {
                    document.getElementById('feedback').textContent = '🎉 All matched!';
                    if (correctAnswers >= answersNeeded) levelUp();
                    else updateDisplay();
                }
            } else {
                document.querySelector(`[data-index="${first}"]`).textContent = '';
                document.querySelector(`[data-index="${second}"]`).textContent = '';
                document.querySelector(`[data-index="${first}"]`).classList.remove('flipped');
                document.querySelector(`[data-index="${second}"]`).classList.remove('flipped');
            }
            gameData.flipped = [];
        }, 1000);
    }
}

function nextQuestion() {
    document.getElementById('answer').value = '';
    document.getElementById('sequence-input').value = '';
    document.getElementById('puzzle-input').value = '';
    document.getElementById('feedback').textContent = '';
    generateQuestion();
}

function endGame() {
    document.getElementById('game-area').classList.add('hidden');
    document.querySelector('.game-selector').style.display = 'block';
    
    alert(`Game Over!\nFinal Score: ${score}\nLevel Reached: ${level}`);
}

document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkAnswer();
});

document.getElementById('sequence-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkAnswer();
});

document.getElementById('puzzle-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkAnswer();
});