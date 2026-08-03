
//  ---  DOM References  ---

const history = document.getElementById("calc-history");
const input   = document.getElementById("input-box");
const keypad  = document.getElementById("calc-keypad");

const historyContainer = document.querySelector(".history-panel");



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
};
const operations = {
  "×": multiply,
  "÷": divide,
  "+": add,
  "−": subtract,
};

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
const expKeys = [].concat(numbers, notationSymbols, operatorSymbols);

const operatorDisplay = [
  "×", "÷", "+", "−",
];
const validKeys = [
  "0", "1", "2", "3", "4", "5", 
  "6", "7", "8", "9", ".", "*", 
  "/", "+", "-", "_",
  "Delete",  "Backspace", "Enter", 
  "ArrowUp", "ArrowLeft", "ArrowRight",
  "r",
];

let caretOffset       = 0;
let activeExpression  = [];
let calculatorHistory = [];


//  ---  Utils  ---

function contains(term, chars) {
  if (activeExpression.length === 0) return false;
  let termChars = term.split("");
  return termChars.some(char => chars.includes(char));
};



//  ---  History Panel  ---

function updateHistory() {
  history.replaceChildren();

  for (let i = 0; i < calculatorHistory.length; i++) {
    const historyItem = document.createElement("li");
    if (i === 0) historyItem.classList.add("first");
    historyItem.classList.add("item");
    historyItem.id = `item-${i}`

    const expBox = document.createElement("p");
    expBox.classList.add("expression");
    expBox.classList.add("box");
    expBox.textContent = calculatorHistory[i]["expression"].join(" ");

    const dividerBox = document.createElement("p");
    dividerBox.classList.add("divider");
    dividerBox.classList.add("box");
    dividerBox.textContent = "=";

    const ansBox = document.createElement("p");
    ansBox.classList.add("answer");
    ansBox.classList.add("box");
    ansBox.textContent = calculatorHistory[i]["answer"];

    historyItem.appendChild(expBox);
    historyItem.appendChild(dividerBox);
    historyItem.appendChild(ansBox);

    history.appendChild(historyItem);
  };
};

history.addEventListener("mousedown", event => {
  const target = event.target;
  if (target.tagName !== "P" || target.classList.contains("divider")) return;

  let [item, idx] = target.parentElement.id.split("-")

  if (target.classList.contains("expression")) {
    activeExpression = calculatorHistory[Number(idx)]["expression"].slice()

  } else if (target.classList.contains("answer")) {
    const expLength  = activeExpression.length
    const lastTerm   = activeExpression[expLength - 1]
    const targetAnswer = calculatorHistory[Number(idx)]["answer"]
    console.log(expLength)
    if (contains(lastTerm, operatorDisplay) || expLength === 0) activeExpression.push(targetAnswer); 
  };

  input.dispatchEvent(new KeyboardEvent("keydown", {key: "r"}))
});



//  ---  Calculation  ---

function calculate(exp) {
  const currentExp = exp.slice()

  const MD = ["×", "÷"];
  evaluate(exp, MD);
  const AS = ["+", "−"];
  evaluate(exp, AS);

  const currentAnswer = exp.slice();
  if (currentExp.join(" ") === currentAnswer.join(" ")) return;

  calculatorHistory.push({
    "expression": currentExp,
    "answer": currentAnswer.join(),
  });

  updateHistory();
};

function evaluate(exp, operators) {
  while (contains(exp.join(""), operators)) {
    const operatorIdx = exp.findIndex(term => operators.includes(term));
    const firstTermIdx = operatorIdx - 1;
    const secondTermIdx = operatorIdx + 1;

    const answer = operations[exp[operatorIdx]](exp[firstTermIdx], exp[secondTermIdx]);
    exp.splice(firstTermIdx, 3, String(answer));
  };
};

function multiply(x, y) {
  return Number(x) * Number(y);
};

function divide(x, y) {
  return Number(x) / Number(y);
};

function add(x, y) {
  return Number(x) + Number(y);
};

function subtract(x, y) {
  return Number(x) - Number(y);
};



//  ---  Input Box  ---

function validateInput(key, expLength, lastTerm) {

  if (expLength === 0) {
    if (!(numbers.includes(key) || notationSymbols.includes(key))) return;  // Block if input is neither a number or notation
    if (key === "_") {
      activeExpression.push("-");
    } else {
      activeExpression.push(key);
    }

  } else if (expLength > 0) {
    const lastTermChar = lastTerm.slice(lastTerm.length - 1);

    if (numbers.includes(key)) {
      if (contains(lastTerm, operatorDisplay)) {
        activeExpression.push(key);
      } else {
        activeExpression.splice(expLength - 1, 1, lastTerm + key);
      }


    } else if (operatorSymbols.includes(key)) {
      if (
        contains(lastTerm, operatorDisplay) ||  // Block if last input is an operator
        lastTermChar === "-"                     ||  // Block if last character is - or .
        lastTermChar === "."
      ) return;

      activeExpression.push(operatorToDisplay[key]);


    } else if (notationSymbols.includes(key)) {
      switch (key) {
        case ".":
          if (
            contains(lastTerm, operatorDisplay) ||  // Block if last input is an operator
            contains(lastTerm, ["."])           ||  // Block if last input already has decimals
            lastTermChar === "-"                         // Block if last character is a negative sign
          ) return;

          const newInput = lastTerm + key;
          activeExpression.splice(expLength - 1, 1, newInput);
          break;

        case "_":
          if (!contains(lastTerm, operatorDisplay)) return;  // Block if last input is not an operator
          activeExpression.push("-");
          break;
      };
    };
  };
};

input.addEventListener("keydown", event => {
  event.preventDefault();

  const key = event.key;
  if (!validKeys.includes(key)) return;

  const target        = event.target;
  const expLength     = activeExpression.length
  const lastTerm      = activeExpression[expLength - 1]
  let   displayLength = target.value.length;

  switch (key) {
    // Add previous answer to the expression after an operation
    case "ArrowUp":
      const historyLength = calculatorHistory.length
      const targetAnswer = calculatorHistory[historyLength - 1]["answer"]
      if (contains(lastTerm, operatorDisplay) || expLength === 0) activeExpression.push(targetAnswer);
      break;

    // Move caret leftwards or to the front
    case "ArrowLeft":
      if (caretOffset === displayLength) caretOffset = 0;
      else caretOffset += 1;
      break;

    // Move caret rightwards or to the back
    case "ArrowRight":
      if (caretOffset === 0) caretOffset = displayLength;
      else caretOffset -= 1;
      break;

    // Delete latest input
    case "Backspace":
      if (activeExpression.length === 0) return;
      if (lastTerm.length < 2) activeExpression.pop();
      else {
        const lastTermChars   = lastTerm.split("");
        lastTermChars.length -= 1;
        activeExpression.splice(expLength - 1, 1, lastTermChars.join(""))
      };
      break;

    // Delete entire activeExpression
    case "Delete":
      activeExpression.length = 0;
      caretOffset             = 0;
      break;

    // Compute activeExpression
    case "Enter":
      if (expLength === 0) return;
      const lastTermChar = lastTerm.slice(lastTerm.length - 1)
      if (
        contains(lastTerm, operatorDisplay) || // Block if last term has an operator
        lastTermChar === "-"                     || // Block if last character is - or .
        lastTermChar === "."
      ) return;
      calculate(activeExpression);
      historyContainer.scrollTop = historyContainer.scrollHeight;
      caretOffset = 0;
      break;

    // Refresh activeExpression
    case "r":
      break;

    // Input keys
    default:
      if (!expKeys.includes(key)) return;
      validateInput(key, expLength, lastTerm);
      caretOffset = 0;
  };

  // Constuct input display
  target.value = activeExpression.join(" ");

  // Follow caret movement
  displayLength = target.value.length;
  target.scrollLeft = (displayLength * 14) - (caretOffset * 17);

  // Arrow keys' caret navigation
  displayLength -= caretOffset;
  target.setSelectionRange(displayLength, displayLength);
});



//  ---  Keypad  ---

keypad.addEventListener("mousedown", event => {
  const target = event.target;
  if (target.tagName !== "BUTTON") return;

  // Convert buttons into keyboard events
  const id = target.id;
  const key = new KeyboardEvent("keydown", {key: buttonToKey[id]})
  input.dispatchEvent(key);
});



//  ---  Initialization  ---

updateHistory();