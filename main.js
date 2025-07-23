const display = document.querySelector("#display-container");
const buttons = document.querySelectorAll("button").length;

const addBtn = document.querySelector("#plus-btn");
const minusBtn = document.querySelector("#minus-btn");
const multiplyBtn = document.querySelector("#multiply-btn");
const divideBtn = document.querySelector("#divide-btn");

const decimalBtn = document.querySelector("#decimal-btn");

const backspaceBtn = document.querySelector("#backspace-btn");

display.textContent = "0";

let firstValue = 0;
let secondValue = 0;
// let memoryValue = 0;

let currentOperatorType = "";

let valueEntered = false;
let equalClicked = false;
// let equalOperator = false;
// let squareRoot = false;

let inputMode = true;

disableBackspaceButton();

for (let i = 0; i < buttons ; i++) { // add event listener to all buttons
    document.querySelectorAll("button")[i].addEventListener("click", (e) => {
        const buttonPressed = e.target.textContent;

        // TODO: convert to switch cases if possible 
        if (!isNaN(parseInt(buttonPressed))  && display.textContent !== "Error") {
            if (currentOperatorType === "") {
                firstValue = 0; // reset state after clicking equal
            }
            addNumberToDisplay(buttonPressed);
        } else if (buttonPressed === "CE" || buttonPressed === "AC" ) {
            clearDisplay(buttonPressed);
        } else if (buttonPressed === "." && display.textContent !== "Error") {
            if (currentOperatorType === "") {
                firstValue = 0; // reset state after clicking equal
            }
            addDecimal();
        // } else if (buttonPressed === "+/-" && display.textContent !== "Error") {
        //     togglePositiveNegative();
        // } else if (buttonPressed === "%" && display.textContent !== "Error") {
        //     convertToPercentage();
        // } else if (buttonPressed === "√" && display.textContent !== "Error") {
        //     performSquareRoot();
        } else if ((buttonPressed === "+" || buttonPressed === "-" || buttonPressed === "×" || buttonPressed === "÷") && display.textContent !== "Error") {
            setOperator(buttonPressed);
        } else if (buttonPressed === "=" && display.textContent !== "Error") {
            equalClicked = true;
            setOperator(currentOperatorType); 
            enableAllOperatorButtons(); // override disable button function hack
        } else if (buttonPressed === "◄" && display.textContent !== "Error" && inputMode) {
            deleteLastInput();
        } else {    
            // do nothing
        }
    });
}

function addNumberToDisplay (numberButton) {
    const displayText = display.textContent;
    const displayValue = parseFloat(displayText);
    
    if ((displayValue === 0 && !displayText.includes(".")) || !valueEntered) { // if the number input is the first number
        if (displayText.includes("-") && valueEntered) {
            display.textContent = "-" + numberButton;
        } else {
            display.textContent = numberButton;
        }

        enableBackspaceButton();

        inputMode = true;
        valueEntered = true;

        enableAllOperatorButtons();
    } else if (displayText.length >= 10) {
        display.textContent = "Error"; // Maximum 10 characters to avoid overflow outside container
        disableBackspaceButton();
    } else {
        const newValue = displayText.concat(numberButton);
        display.textContent = newValue;

        enableBackspaceButton();
    }
}

function setOperator (operator) {
    const displayText = display.textContent;

    if (currentOperatorType === "") { // entering first number of the pair
        firstValue = parseFloat(displayText);
    } else if (currentOperatorType === "+") { 
        if (valueEntered) {           // entering second number of the pair
            secondValue = parseFloat(displayText);
        }                             // else, does nothing here, only possible if switching operator without number entered 
        performAddition();
    } else if (currentOperatorType === "-") {
        if (valueEntered) { 
            secondValue = parseFloat(displayText);
        } 
        performSubtraction();
    } else if (currentOperatorType === "×") {
        if (valueEntered) { 
            secondValue = parseFloat(displayText);
        } 
        performMultiplication();
    } else if (currentOperatorType === "÷") {
        if (valueEntered) { 
            secondValue = parseFloat(displayText);
        } 
        performDivision();
    }

    valueEntered = false;
    currentOperatorType = operator;

    if (equalClicked) {
        currentOperatorType = "";
        secondValue = 0;
        equalClicked = false;
    }

    enableAllOperatorButtons();
    disableButton(operator);
    disableBackspaceButton();
}

function clearDisplay (clearType) {
    if (clearType === "AC" || display.textContent === "Error") {
        firstValue = 0;
        secondValue = 0;
        // memoryValue = 0;
        // changeButtonStyle("clear");
    }

    // if (squareRoot) {
    //     firstValue = 0;
    //     currentOperatorType = "";
    // }

    display.textContent = 0;

    currentOperatorType = "";
    enableAllOperatorButtons();
    disableBackspaceButton();
    decimalBtn.disabled = false;

    // document.querySelector("#percentage-btn").disabled = false;
}

function performAddition() {
    firstValue += secondValue;

    displayResult(firstValue);
}

function performSubtraction() {
    firstValue -= secondValue;

    displayResult(firstValue);
}

function performMultiplication() {
    firstValue *= secondValue;

    displayResult(firstValue);
}

function performDivision() {
    firstValue /= secondValue;

    displayResult(firstValue);
}

function displayResult (result) {
    if (result.toString().length > 10) {
        const roundedValue = roundToPrecisionTenChar(result); // round floating number to avoid overflow outside container
        if (roundedValue.toString().length > 10) {
            display.textContent = "Error";
        } else {
            display.textContent = roundedValue;
        }
    } else {
        display.textContent = result;
    }
}

function roundToPrecisionTenChar (originalValue) {
    const valueString = originalValue.toString();
    const decimalPosition = valueString.indexOf(".") + 1;

    // negative is also count as a character, need to account it to display at most 10 character in the container
    if (!valueString.includes("-")) {
        const roundAmount = Math.pow(10, (10 - decimalPosition));
        return Math.round(originalValue * roundAmount) / roundAmount;
    } else {
        const roundAmount = Math.pow(10, (9 - decimalPosition));
        return Math.round(originalValue * roundAmount) / roundAmount;
    }
}

function addDecimal () {  
    const displayText = display.textContent;

    if (displayText !== "Error") {
        const newValue = display.textContent.concat(".");
        if (newValue.length >= 10) {
            display.textContent = "Error"; // Maximum 10 characters to avoid overflow outside container
        } else if (!valueEntered) {
            display.textContent = "0".concat(".");
            valueEntered = true;
            decimalBtn.disabled = true;
        } else {
            display.textContent = newValue;
            decimalBtn.disabled = true;
        }
    }

    enableBackspaceButton();
}

function deleteLastInput () {
    const displayValue = display.textContent;

    const newValue = displayValue.slice(0, -1); // delete last letter of the string value

    if (!newValue.includes(".")) {
        decimalBtn.disabled = false;
    } 

    if (newValue.length === 0 || (newValue.length === 1 && newValue === "0")) {
        display.textContent = "0";
        disableBackspaceButton();
    } else {
        display.textContent = newValue;
    }
}

function disableButton (operator) {
    if (operator === "+") {
        addBtn.style.backgroundColor = "white";
        addBtn.style.color = "black";
        addBtn.disabled = true;
    } else if (operator === "-") {
        minusBtn.style.backgroundColor = "white";
        minusBtn.style.color = "black";
        minusBtn.disabled = true;
    } else if (operator === "×") {
        multiplyBtn.style.backgroundColor = "white";
        multiplyBtn.style.color = "black";
        multiplyBtn.disabled = true;
    } else if (operator === "÷") {
        divideBtn.style.backgroundColor = "white";
        divideBtn.style.color = "black";
        divideBtn.disabled = true;
    }
}

function enableAllOperatorButtons () {
    addBtn.style.backgroundColor = "#ee9f27";
    addBtn.style.color = "white";
    addBtn.disabled = false;

    minusBtn.style.backgroundColor = "#ee9f27";
    minusBtn.style.color = "white";
    minusBtn.disabled = false;

    multiplyBtn.style.backgroundColor = "#ee9f27";
    multiplyBtn.style.color = "white";
    multiplyBtn.disabled = false;

    divideBtn.style.backgroundColor = "#ee9f27";
    divideBtn.style.color = "white";
    divideBtn.disabled = false;    
}

function disableBackspaceButton () {
    backspaceBtn.style.backgroundColor = "white";
    backspaceBtn.style.color = "black";
    backspaceBtn.disabled = true;
}

function enableBackspaceButton () {
    backspaceBtn.style.backgroundColor = "#97536a";
    backspaceBtn.style.color = "white";
    backspaceBtn.disabled = false;
}

document.addEventListener("keydown", (e) => {
    const keyName = e.key;

    switch (keyName) {
        case "Backspace":
            if (!backspaceBtn.disabled) {
                deleteLastInput ();
            }
            break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            if (display.textContent !== "Error") {
                if (currentOperatorType === "") {
                    firstValue = 0; // reset state after clicking equal
                }
                addNumberToDisplay(keyName);
            }
            break;
        case "+":
            if (!addBtn.disabled){
                if (display.textContent !== "Error") {
                    setOperator(keyName);
                }
            }
            break;
        case "-":
            if (!minusBtn.disabled){
                if (display.textContent !== "Error") {
                    setOperator(keyName);
                }
            }
            break;
        case "*":
            if (!multiplyBtn.disabled){
                if (display.textContent !== "Error") {
                    setOperator("×");
                }
            }
            break;
        case "/":
            if (!divideBtn.disabled){
                if (display.textContent !== "Error") {
                    setOperator("÷");
                }
            }
            break;
        case ".":
            if (!backspaceBtn.disabled) {
                if (display.textContent !== "Error") {
                    if (currentOperatorType === "") {
                        firstValue = 0; // reset state after clicking equal
                    }
                    addDecimal();
                }
            }
            break;
        case "Enter":
            if (display.textContent !== "Error") {
                equalClicked = true;
                setOperator(currentOperatorType); 
                enableAllOperatorButtons(); // override disable button function hack
            }
            break;
        default:
            return;
    }
  },
  false,
);

// function togglePositiveNegative () {
//     const displayText = display.textContent;

//     if (displayText.includes("-") && displayText.length <= 10) {
//         display.textContent = displayText.slice(1);
//     } else if (displayText.length >= 10) {
//         display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
//     } else {
//         const negativeValue = "-" + displayText;
//         display.textContent = negativeValue;
//     }
// }

// function convertToPercentage () {
//     const displayText = display.textContent;
//     const displayValue = parseFloat(displayText);

//     const newValue = roundToPrecisionPercentage(displayValue).toString();

//     if (newValue.length > 10 || newValue.includes("e")) {
//         display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
//     } else {
//         display.textContent = newValue;
//         document.querySelector("#decimal-btn").disabled = true;
//     }
// }

// function roundToPrecisionPercentage (originalValue) {
//     const precision = Math.pow(10, 10); // 10 digits maximum
//     return (Math.round((originalValue * precision ) / precision) / 100);
// }

// function performSquareRoot () {
//     const displayText = display.textContent;

//     if (displayText.includes("-")) {
//         if (displayText === "-0") {
//             togglePositiveNegative();
//         } else {
//             display.textContent = "Error";
//         }
//     } else {
//         if (currentOperatorType === "") {
//             if (!squareRoot) {
//                 const displayValue = parseFloat(displayText);
//                 var newValue = Math.sqrt(displayValue);
//                 firstValue = newValue;
//                 squareRoot = true;
//             } else if (squareRoot){
//                 var newValue = Math.sqrt(firstValue);
//                 firstValue = newValue;
//                 squareRoot = true;
//             } 
//         } else if (currentOperatorType === "+" || currentOperatorType === "-" || currentOperatorType === "×" || currentOperatorType === "÷") {
//             if (!squareRoot) {
//                 const displayValue = parseFloat(displayText);
//                 var newValue = Math.sqrt(displayValue);
//                 secondValue = newValue;
//                 squareRoot = true;
//             } else if (squareRoot){
//                 var newValue = Math.sqrt(secondValue);
//                 secondValue = newValue;
//                 squareRoot = true;
//             } 
//         }

//         if (newValue.toString().includes("e")) {
//             display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
//         } else if (newValue.toString().length > 10) {
//             // const roundedValue = (roundToPrecision(newValue)*100).toString();
//             display.textContent = roundToPrecisionTenChar(newValue).toString();
//         } else {
//             display.textContent = newValue.toString();
//         }
//     }
// }