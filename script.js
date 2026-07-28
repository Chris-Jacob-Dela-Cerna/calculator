
//  ---  DOM References  ---

const input = document.getElementById("input");



//  ---  Configs  ---

const validKeys = [
  "0", "1", "2", "3", "4", 
  "5", "6", "7", "8", "9", 
  ".", "*", "/", "+", "-",
  "Delete",    "Backspace", 
  "Enter",     "ArrowUp",
  "ArrowLeft", "ArrowRight",
];

let inputCaretOffset = 0



//  ---  History Panel  ---



//  ---  Input Box  ---

input.addEventListener("keydown", event => {
  event.preventDefault();

  const key = event.key;
  const target = event.target;

  if (!validKeys.includes(key)) {
    return; 
  } else if (key === "ArrowLeft") {
    if (inputCaretOffset === target.value.length) {
      inputCaretOffset = 0
    } else inputCaretOffset += 1
  } else if (key === "ArrowRight") {
    if (inputCaretOffset === 0) {
      inputCaretOffset = target.value.length
    } else inputCaretOffset -= 1
  } else if (["1"].includes(key)) {
    target.value += key;
    inputCaretOffset = 0
  }

  let length = target.value.length
  length -= inputCaretOffset
  target.setSelectionRange(length, length)
  target.scrollLeft = target.scrollWidth
});



//  ---  Keypad  ---