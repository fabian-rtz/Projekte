const length = 12;

const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const lowerCase = "abcdefghijklmnopqrstuvwxyz"
const number = "1234567890";
const symbol = "@#$%^&*()_+~|{}[]></-="

const allChars = upperCase + lowerCase + number + symbol;


function Generate(){
    let password = "";
    password += upperCase[Math.floor(Math.random() * upperCase.length)] 
    password += lowerCase[Math.floor(Math.random() * lowerCase.length)] 
    password += number[Math.floor(Math.random() * number.length)] 
    password += symbol[Math.floor(Math.random() * symbol.length)] 

    while(length > password.length){
        password += allChars[Math.floor(Math.random() * allChars.length)] 
    }
    
    document.getElementById("ipField").value = password;
   
}
function CopyText(){
    var textBox = document.getElementById("ipField");
    textBox.select();
    document.execCommand("copy");
}
