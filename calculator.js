const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let operator = null;
let previousInput = null;
let resetDisplay = false;

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent;
        const buttonAction = button.dataset.action;

        if (!buttonAction) { // It's a digit button
            handleDigit(buttonText);
        } else if (buttonAction === 'clear') {
            handleClear();
        } else if (buttonAction === 'decimal') {
            handleDecimal();
        } else if (buttonAction === 'equals') {
            handleEquals();
        } else { // It's an operator
            handleOperator(buttonAction);
        }
        updateDisplay();
    });
});

function handleDigit(digit) {
    if (resetDisplay) {
        currentInput = digit;
        resetDisplay = false;
    } else {
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
}

function handleClear() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    resetDisplay = false;
}

function handleDecimal() {
    if (resetDisplay) {
        currentInput = '0.';
        resetDisplay = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
}

function handleOperator(nextOperator) {
    if (operator && !resetDisplay) {
        calculate();
    }
    previousInput = currentInput;
    operator = nextOperator;
    resetDisplay = true;
}

function handleEquals() {
    if (operator && previousInput !== null) {
        calculate();
        operator = null;
        resetDisplay = true; // Keep the result for further operations
    }
}

function calculate() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(current)) return;

    let result;
    switch (operator) {
        case 'add':
            result = prev + current;
            break;
        case 'subtract':
            result = prev - current;
            break;
        case 'multiply':
            result = prev * current;
            break;
        case 'divide':
            result = prev / current;
            break;
        default:
            return;
    }
    currentInput = result.toString();
}

function updateDisplay() {
    display.textContent = currentInput;
}