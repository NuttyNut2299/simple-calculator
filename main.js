const display = document.querySelector("#display-container");
const buttons = document.querySelectorAll("button").length;

display.textContent = "0";

let firstValue = 0;
let secondValue = 0;
let memoryValue = 0;
let operatorType = "";

for (let i = 0; i < buttons ; i++) { // add event listner to all buttons
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
        } else {
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
    // const displayText = display.textContent;
    // const displayValue = parseFloat(displayText);

    // const newValue = (displayValue / 100).toPrecision(2).toString();
    // console.log(newValue);
    // if (newValue.length >= 10) {
    //     display.textContent = "Error"; // Maximum 10 digits to avoid precision issues with floating point and int
    // } else {
    //     display.textContent = newValue;
    //     document.querySelector("#decimal-btn").disabled = true;
    //     // document.querySelector("#percentage-btn").disabled = true;
    // }
}


function clearDisplay (clearType) {
    if (clearType === "AC") {
        firstValue = 0;
        secondValue = 0;
        memoryValue = 0;
    }
    display.textContent = 0;
    document.querySelector("#decimal-btn").disabled = false;
    // document.querySelector("#percentage-btn").disabled = false;
}