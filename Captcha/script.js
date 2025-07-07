let allCharacters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
't', 'u', 'v', 'w', 'x', 'y', 'z', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

document.addEventListener("DOMContentLoaded", function() {
    getCaptcha(); // Call getCaptcha function
});
getCaptcha();            
function getCaptcha() {
    const captchaText = document.getElementById("captcha-text");
    let newCaptcha = ""; // Initialize a variable to store the new captcha
    for (let i = 0; i < 6; i++) { 
        let randomCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)];
        newCaptcha += randomCharacter;
    }
    captchaText.innerHTML = newCaptcha; // Set the innerHTML of captcha-text to the new captcha
}

function checkCaptcha() {
    const captchaText = document.getElementById("captcha-text");
    const captchaInput = document.getElementById("captcha-input");

    if (captchaText.innerHTML === captchaInput.value) {
        alert("Du bist kein Roboter");
    } else {
        alert("Deine Angabe ist falsch!");
    }
}
