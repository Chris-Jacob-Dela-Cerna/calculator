
//  ---  DOM References  ---

const keypad = document.getElementById("calc-keypad");
const input = document.getElementById("input-box");



//  ---  Configs  ---

const buttonToKey = {
  "0-button": "0",    "1-button": "1",    "2-button": "2",
  "3-button": "3",    "4-button": "4",    "5-button": "5",
  "6-button": "6",    "7-button": "7",    "8-button": "8", 
  "9-button": "9", 
  "decimal-button":   ".",
  "multiply-button":  "*",
  "divide-button":    "/",
  "add-button":       "+",
  "subtract-button":  "-",
  "negative-button":  "_",
  "clear-all-button": "Delete",
  "clear-button":     "Backspace",
  "answer-button":    "ArrowUp",
  "equal-button":     "Enter",
};
const operatorToDisplay = {
  "*": "×",
  "/": "÷",
  "+": "+",
  "-": "−",
}

const numbers = [
  "0", "1", "2", "3", "4", 
  "5", "6", "7", "8", "9",
];
const notationSymbols = [
  ".", "_",
];
const operatorSymbols = [
  "*", "/", "+", "-",
];
const expKeys = [].concat(numbers, notationSymbols, operatorSymbols)

const operatorDisplay = [
  "×", "÷", "+", "−",
];

const validKeys = [
  "0", "1", "2", "3", "4", "5", 
  "6", "7", "8", "9", ".", "*", 
  "/", "+", "-", "_",
  "Delete",    "Backspace", 
  "Enter",     "ArrowUp",
  "ArrowLeft", "ArrowRight",
];

let caratOffset = 0;
let expression = [];



//  ---  Utils  ---

function includesChars(term, chars=[]) {
  let termChars = term.split("");
  return termChars.filter(char => chars.includes(char))
                  .length > 0 ? true : false;
};



//  ---  History Panel  ---



//  ---  Input Box  ---

function validateInput(key, expLength, lastTerm) {

  if (expLength === 0) {
    if (
      numbers.includes(key) || 
      notationSymbols.includes(key)
    ) {
      if (key !== "_") expression.push(key);
      else expression.push("-");
    }


  } else if (expLength > 0) {
    const lastTermChar = lastTerm.slice(lastTerm.length - 1);

    if (numbers.includes(key)) {
      // Create new input if previous input has operators
      if (includesChars(lastTerm, operatorDisplay) === true) {
        expression.push(key);
      } else {
        const newInput = lastTerm + key;
        expression.splice(expLength - 1, 1, newInput);
      }

    } else if (operatorSymbols.includes(key)) {
      if (includesChars(lastTerm, operatorDisplay) === true) return;  // Block if last input is an operator
      if (lastTermChar === "-" || lastTermChar === ".")     return;  // Block if last character is - or .
      expression.push(operatorToDisplay[key]);

    } else if (notationSymbols.includes(key)) {
      if (key === ".") {
        if (includesChars(lastTerm, operatorDisplay) === true) return;  // Block if last input is an operator
        if (includesChars(lastTerm, ["."])) return;  // Block if last input already has decimals
        if (lastTermChar === "-") return;   // Block if last character is a negative sign

        const newInput = lastTerm + key;
        expression.splice(expLength - 1, 1, newInput);

      } else if (key === "_") {
        if (includesChars(lastTerm, operatorDisplay) === false) return;
        expression.push("-");
      }
    }
  }
}

input.addEventListener("keydown", event => {
  event.preventDefault();

  const key = event.key;
  if (!validKeys.includes(key)) return;

  const target        = event.target;
  const expLength     = expression.length
  const lastTerm      = expression[expLength - 1]
  let   displayLength = target.value.length;

  switch (key) {
    // Move caret leftwards or to the front
    case "ArrowLeft":
      if (caratOffset === displayLength) caratOffset = 0;
      else caratOffset += 1;
      break;

    // Move caret rightwards or to the back
    case "ArrowRight":
      if (caratOffset === 0) caratOffset = displayLength;
      else caratOffset -= 1;
      break;

    // Delete latest input
    case "Backspace":
      if (expression.length === 0) return;
      if (lastTerm.length < 2) expression.pop();
      else {
        const lastTermChars   = lastTerm.split("");
        lastTermChars.length -= 1;
        expression.length    -= 1;
        expression.push(lastTermChars.join(""));
      }
      break;

    // Delete entire expression
    case "Delete":
      expression.length = 0;
      caratOffset       = 0;
      break;

    default:
      if (!expKeys.includes(key)) return;
      validateInput(key, expLength, lastTerm);
      caratOffset = 0;
  };

  target.value = expression.join(" ");

  // Follow caret movement
  displayLength = target.value.length;
  target.scrollLeft = (displayLength * 14) - (caratOffset * 17);

  // Arrow keys' caret navigation
  displayLength -= caratOffset;
  target.setSelectionRange(displayLength, displayLength);
});



//  ---  Keypad  ---

keypad.addEventListener("mousedown", event => {
  const target = event.target;
  if (target.tagName !== "BUTTON") return;

  // Convert button clicks into keyboard events for input
  const id = target.id;
  if (id in buttonToKey) {
    const key = new KeyboardEvent("keydown", {key: buttonToKey[id]})
    input.dispatchEvent(key);
  };
});