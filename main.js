const display = document.querySelector("#display-container");
const buttons = document.querySelectorAll("button").length;

display.textContent = "0";

let firstValue = 0;
let secondValue = 0;
let memoryValue = 0;

let lastOperatorType = "";
let currentOperatorType = "";
let squareRoot = false;

for (let i = 0; i < buttons ; i++) { // add event listener to all buttons
    document.querySelectorAll("button")[i].addEventListener("click", (e) => {
        const buttonPressed = e.target.textContent;

        // TODO: convert to switch cases if possible 
        if (!isNaN(parseInt(buttonPressed))  && display.textContent !== "Error") {
            addNumberToDisplay(buttonPressed);
        } else if (buttonPressed === "CE" || buttonPressed === "AC" ) {
            clearDisplay(buttonPressed);
        } else if (buttonPressed === "." && display.textContent !== "Error") {
            addDecimal();
        } else if (buttonPressed === "+/-" && display.textContent !== "Error") {
            togglePositiveNegative();
        } else if (buttonPressed === "%" && display.textContent !== "Error") {
            convertToPercentage();
        } else if (buttonPressed === "√" && display.textContent !== "Error") {
            performSquareRoot();
        }else {
            console.log("nothing");
        }
    });
}

function addNumberToDisplay (numberButton) {
    const displayText = display.textContent;
    const displayValue = parseFloat(displayText);
    
    if (displayValue === 0 && !displayText.includes(".")) {
        if (displayText.includes("-")) {
            display.textContent = "-" + numberButton;
        } else {
            display.textContent = numberButton;
        }
    } else if (displayText.length >= 10) {
        display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
    } else {
        const newValue = displayText.concat(numberButton);
        display.textContent = newValue;
    }
}

function addDecimal () {  
    const displayText = display.textContent;

    if (displayText !== "Error") {
        const newValue = display.textContent.concat(".");
        if (newValue.length >= 10) {
            display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
        } else {
            display.textContent = newValue;
            document.querySelector("#decimal-btn").disabled = true;
        }
    }

}

function togglePositiveNegative () {
    const displayText = display.textContent;

    if (displayText.includes("-") && displayText.length <= 10) {
        display.textContent = displayText.slice(1);
    } else if (displayText.length >= 10) {
        display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
    } else {
        const negativeValue = "-" + displayText;
        display.textContent = negativeValue;
    }
}

function convertToPercentage () {
    const displayText = display.textContent;
    const displayValue = parseFloat(displayText);

    const newValue = roundToPrecisionPercentage(displayValue).toString();

    if (newValue.length > 10 || newValue.includes("e")) {
        display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
    } else {
        display.textContent = newValue;
        document.querySelector("#decimal-btn").disabled = true;
    }
}

function clearDisplay (clearType) {
    if (clearType === "AC") {
        firstValue = 0;
        secondValue = 0;
        memoryValue = 0;
        lastOperatorType = "";
        currentOperatorType = "";
    }

    if (squareRoot) {
        firstValue = 0;
        currentOperatorType = "";
    }

    display.textContent = 0;

    document.querySelector("#decimal-btn").disabled = false;
    // document.querySelector("#percentage-btn").disabled = false;
}

function roundToPrecisionPercentage (originalValue) {
    const precision = Math.pow(10, 10); // 10 digits maximum
    return (Math.round((originalValue * precision ) / precision) / 100);
}

function roundToPrecisionTenChar (originalValue) {
    const valueString = originalValue.toString();
    const decimalPosition = valueString.indexOf(".") + 1;

    if (!valueString.includes("-")) {
        const roundAmount = Math.pow(10, (10 - decimalPosition));
        return Math.round(originalValue * roundAmount) / roundAmount;
    } else {
        const roundAmount = Math.pow(10, (9 - decimalPosition));
        return Math.round(originalValue * roundAmount) / roundAmount;
    }
}

function performSquareRoot () {
    const displayText = display.textContent;
    if (displayText.includes("-")) {
        if (displayText === "-0") {
            togglePositiveNegative();
        } else {
            display.textContent = "Error";
        }
    } else {
        if (currentOperatorType === "") {
            if (!squareRoot) {
                const displayValue = parseFloat(displayText);
                var newValue = Math.sqrt(displayValue);
                firstValue = newValue;
                squareRoot = true;
            } else if (squareRoot){
                var newValue = Math.sqrt(firstValue);
                firstValue = newValue;
                squareRoot = true;
            } 
        }
        else if (currentOperatorType === "+" || currentOperatorType === "-" || currentOperatorType === "×" || currentOperatorType === "÷") {
            if (!squareRoot) {
                const displayValue = parseFloat(displayText);
                var newValue = Math.sqrt(displayValue);
                secondValue = newValue;
                squareRoot = true;
            } else if (squareRoot){
                var newValue = Math.sqrt(secondValue);
                secondValue = newValue;
                squareRoot = true;
            } 
        }

        if (newValue.toString().includes("e")) {
            display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
        } else if (newValue.toString().length > 10) {
            // const roundedValue = (roundToPrecision(newValue)*100).toString();
            display.textContent = roundToPrecisionTenChar(newValue).toString();
        } else {
            display.textContent = newValue.toString();
        }
    }
}