
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
  "subtract-button":  "-",
  "negative-button":  "_",
  "clear-all-button": "Delete",
  "clear-button":     "Backspace",
  "equal-button":     "Enter",
};
const inputKeys = [
  "0", "1", "2", "3", "4", "5", 
  "6", "7", "8", "9", ".", "*", 
  "/", "+", "-", "_",
];
const validKeys = [
  "0", "1", "2", "3", "4", "5", 
  "6", "7", "8", "9", ".", "*", 
  "/", "+", "-", "_",
  "Delete",    "Backspace", 
  "Enter",     "ArrowUp",
  "ArrowLeft", "ArrowRight",
];

let inputCaretOffset = 0;



//  ---  History Panel  ---



//  ---  Input Box  ---

input.addEventListener("keydown", event => {
  event.preventDefault();

  const key = event.key;
  const target = event.target;
  let length = target.value.length  // Read length before conditionals

  if (!validKeys.includes(key)) {
    return;
  } else if (inputKeys.includes(key)) {
    target.value += key;
    inputCaretOffset = 0;
  } else {
    switch (key) {
      case "ArrowLeft":
        if (inputCaretOffset === length) {
          inputCaretOffset = 0;
        } else {
          inputCaretOffset += 1;
        } break;
      case "ArrowRight":
        if (inputCaretOffset === 0) {
          inputCaretOffset = length;
        } else { 
          inputCaretOffset -= 1;
        } break;
    };
  };

  // Update length after conditionals
  length = target.value.length;
  // Follow caret movement from left to right
  target.scrollLeft = (length * 14) - (inputCaretOffset * 17);

  // Caret navigation for arrow keys
  length -= inputCaretOffset;
  target.setSelectionRange(length, length);
});



//  ---  Keypad  ---

keypad.addEventListener("mousedown", event => {
  const target = event.target;
  if (target.tagName !== "BUTTON") return;

  const id = target.id
  if (id in buttonToKey) {
    input.dispatchEvent(new KeyboardEvent("keydown", {key: buttonToKey[id]}))
  };
});