const display = document.querySelector("#display-container");
const buttons = document.querySelectorAll("button").length;

let firstValue = 0;
let secondValue = 0;
let memoryValue = 0;
let operatorType = "";

for (let i = 0; i < buttons ; i++) { // add event listner to all buttons
    document.querySelectorAll("button")[i].addEventListener("click", (e) => {
        const buttonPressed = e.target.textContent;

        if (!isNaN(parseInt(buttonPressed))) {
            addNumberToDisplay(buttonPressed);
        } else if (buttonPressed === "CE" || buttonPressed === "AC" ) {
            clearDisplay(buttonPressed);
        }
    });
}

function addNumberToDisplay (numberButton) {
    const displayText = display.textContent;
    const displayValue = parseFloat(displayText);
    
    if (displayValue === 0) {
        display.textContent = numberButton;
    } else if (displayText.length === 10) {
        display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
    } else if (displayText === 'Error') {
        // do nothing
    } else {
        const newValue = displayText.concat(numberButton);
        display.textContent = newValue;
    }
}

function clearDisplay (clearType) {
    if (clearType === "AC") {
        firstValue = 0;
        secondValue = 0;
        memoryValue = 0;
    }
    display.textContent = 0;
}