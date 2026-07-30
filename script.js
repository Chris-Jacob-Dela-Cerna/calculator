
//  ---  DOM References  ---

const keypad = document.getElementById("calc-keypad");
const input = document.getElementById("input-box");



//  ---  Configs  ---

const buttonToKey = {
  "0-button": "0", "1-button": "1", "2-button": "2",
  "3-button": "3", "4-button": "4", "5-button": "5",
  "6-button": "6", "7-button": "7", "8-button": "8", 
  "9-button": "9", 
  "decimal-button":   ".",
  "multiply-button":  "*",
  "divide-button":    "/",
  "add-button":       "+",
  "subtract-button":  "_",
  "negative-button":  "-",
  "clear-all-button": "Delete",
  "clear-button":     "Backspace",
  "answer-button":    "ArrowUp",
  "equal-button":     "Enter",
};
const operatorToDisplay = {
  "*": "×",
  "/": "÷",
  "+": "+",
  "_": "−",
}

const numbers = [
  "0", "1", "2", "3", "4", 
  "5", "6", "7", "8", "9",
]
const notationSymbols = [
  ".", "-",
]
const operatorSymbols = [
  "*", "/", "+", "_",
]
const inputKeys = [].concat(numbers, notationSymbols, operatorSymbols)

const operatorDisplay = [
  "×", "÷", "+", "−",
]

const validKeys = [
  "0", "1", "2", "3", "4", "5", 
  "6", "7", "8", "9", ".", "*", 
  "/", "+", "-", "_",
  "Delete",    "Backspace", 
  "Enter",     "ArrowUp",
  "ArrowLeft", "ArrowRight",
];

let inputCaretOffset = 0;
let inputComputation = [];



//  ---  Utils  ---

function includesChars(inputStr, chars=[]) {
  let inputChars = inputStr.split("")
  inputChars = inputChars.filter(character => chars.includes(character))
  return inputChars.length > 0
}



//  ---  History Panel  ---



//  ---  Input Box  ---

function validateInput(key) {

  const length = inputComputation.length
  const lastInput = inputComputation[length - 1]

  if (length < 1) {
    if (
      numbers.includes(key) || 
      notationSymbols.includes(key)
    ) inputComputation.push(key);

  } else if (length > 0) {
    const lastInputChar = lastInput.slice(lastInput.length - 1)

    if (numbers.includes(key)) {
      // Create new input if previous input has operators
      if (includesChars(lastInput, operatorDisplay) === true) {
        inputComputation.push(key)
      // Otherwise, concat to the last input
      } else {
        const newInput = lastInput + key;
        inputComputation.splice(length - 1, 1, newInput);
      }

    } else if (operatorSymbols.includes(key)) {
      if (includesChars(lastInput, operatorDisplay) === false) {
        if (
          lastInputChar === "-" ||
          lastInputChar === "."
        ) return;
        inputComputation.push(operatorToDisplay[key])
      }
    }
  }
}

input.addEventListener("keydown", event => {
  event.preventDefault();

  const key = event.key;
  const target = event.target;
  let length = target.value.length  // Read length before conditionals

  if (!validKeys.includes(key)) return;

  switch (key) {
    case "ArrowLeft":
      // Move caret leftwards or to the front
      if (inputCaretOffset === length) {
        inputCaretOffset = 0;
      } else {
        inputCaretOffset += 1;
      } break;

    case "ArrowRight":
      // Move caret rightwards or to the back
      if (inputCaretOffset === 0) {
        inputCaretOffset = length;
      } else { 
        inputCaretOffset -= 1;
      } break;
    
    case "Delete":
      // Clear all active input
      inputComputation = []
      inputCaretOffset = 0

    default:
      if (inputKeys.includes(key)) {
        validateInput(key)
        inputCaretOffset = 0;
      };
  };
  target.value = inputComputation.join(" ");

  // Follow caret movement
  length = target.value.length;  // Update length after conditionals
  target.scrollLeft = (length * 14) - (inputCaretOffset * 17);

  // Arrow keys' caret navigation
  length -= inputCaretOffset;
  target.setSelectionRange(length, length);

  console.log(inputComputation)
});



//  ---  Keypad  ---

keypad.addEventListener("mousedown", event => {
  const target = event.target;
  if (target.tagName !== "BUTTON") return;

  // Convert button.id into keyboard events for input-box
  const id = target.id;
  if (id in buttonToKey) {
    input.dispatchEvent(new KeyboardEvent("keydown", {
      key: buttonToKey[id]
    }));
  };
});