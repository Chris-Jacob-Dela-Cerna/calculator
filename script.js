
//  ---  DOM References  ---

const input = document.getElementById("input");



//  ---  Configs  ---



//  ---  History Panel  ---



//  ---  Input Box  ---

input.addEventListener("keydown", event => {
  event.preventDefault();

  const key = event.key;
  const target = event.target;
  const validKeys = [
    "0", "1", "2", "3", "4", 
    "5", "6", "7", "8", "9", 
    ".", "*", "/", "+", "-"
  ];
  if (validKeys.includes(key)) target.value += key;
});



//  ---  Keypad  ---