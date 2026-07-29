
//  ---  DOM References  ---

const input = document.getElementById("input");



//  ---  Configs  ---

const inputKeys = [
  "0", "1", "2", "3", "4", 
  "5", "6", "7", "8", "9", 
  ".", "*", "/", "+", "-",
];
const validKeys = [
  "0", "1", "2", "3", "4", 
  "5", "6", "7", "8", "9", 
  ".", "*", "/", "+", "-",
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
  length = target.value.length 
  // Follow caret movement from left to right
  target.scrollLeft = (length * 14) - (inputCaretOffset * 17) 

  // Caret navigation for arrow keys
  length -= inputCaretOffset
  target.setSelectionRange(length, length)
});



//  ---  Keypad  ---