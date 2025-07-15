 
function  calculate(firstNumber,operator,secondNumber) {
    let input = document.getElementById("display"); 
    switch (operator) {
        case '+':         
            input.value = firstNumber + secondNumber;  
            break;
        case '-':
            input.value = firstNumber - secondNumber; 
            break;
        case '*':
            input.value = firstNumber * secondNumber; 
            break;
        case '/':
            input.value = firstNumber / secondNumber; 
            break;
        default:
            break;
    }
    
}
function setInput(){
    let input = document.getElementById("display"); 
    let regex = /(\d+\.?\d*)([+\-*\/])(\d+\.?\d*)/;
    let match = input.value.match(regex);

    if (match) {
        let firstNumber = parseFloat(match[1]);
        let operator = match[2];
        let secondNumber = parseFloat(match[3]);
        
        calculate(firstNumber,operator,secondNumber);
    } else {
       alert("Bitte Eingabe überprüfen!");        
    }
}