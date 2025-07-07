var elementSelection;
var Opacity;

var shakeInProgress = false; // Eine Flagge, um den Status der Shake-Animation zu verfolgen

function selectHand(hand) {
    // Überprüfe, ob die Shake-Animation gerade läuft
    if (shakeInProgress) {
        return; // Beende die Funktion, wenn eine Shake-Animation läuft
    }
    resetGameHand();
    switch (hand) {
        case 'rock':
            elementSelection = document.getElementById("rock");
            Opacity = parseFloat(window.getComputedStyle(elementSelection).opacity);
            changeOpacity(Opacity, elementSelection,hand);
            break;
        case 'paper':
            elementSelection = document.getElementById("paper");
            Opacity = parseFloat(window.getComputedStyle(elementSelection).opacity);
            changeOpacity(Opacity, elementSelection,hand);
            break;
        case 'scissors':
            elementSelection = document.getElementById("scissors");
            Opacity = parseFloat(window.getComputedStyle(elementSelection).opacity);
            changeOpacity(Opacity, elementSelection,hand);
            break;
        default:
            break;
    }
}


function changeOpacity(Opacity, elementSelection,hand) {
    if (Opacity === 0.5) {
        elementSelection.style.opacity = 1;
        elementSelection.style.transform = 'scale(1.1)';
    } else {
        elementSelection.style.opacity = 0.5;
        elementSelection.style.transform = 'scale(1)';
    }
    startGame(hand);
}


function startShake() {
    shakeInProgress = true; // Setze die Flagge, um anzuzeigen, dass die Shake-Animation gestartet wurde
    document.getElementById("GameinProgress").innerHTML  ="Warte....";
    document.getElementById("WinnerText").innerHTML ='';
    var elementKI = document.getElementById("ki");
    elementKI.classList.add('shake-animation');
    // Event-Listener, der auf das Ende der Animation reagiert
    elementKI.addEventListener('animationend', function() {
        // Entferne die Shake-Klasse nach dem Ende der Animation
        elementKI.classList.remove('shake-animation');
        shakeInProgress = false; // Setze die Flagge zurück, um anzuzeigen, dass die Shake-Animation beendet wurde
        document.getElementById("GameinProgress").innerHTML  ="Lass uns Spielen !!";
       
        resetSelectionHand();
        changeKIHand();
        getWinner();
    }, {once: true}); // Die Event-Listener wird nur einmal ausgeführt
}


function getWinner(){
    var elementPlayer = document.getElementById("player");
    var elementKI = document.getElementById("ki");

    if((elementPlayer.src.includes('rock') && elementKI.src.includes('rock')) 
    || (elementPlayer.src.includes('paper') && elementKI.src.includes('paper')) 
    || (elementPlayer.src.includes('scissors') && elementKI.src.includes('scissors'))){
        document.getElementById("WinnerText").innerHTML ="Unentschieden!";
        document.getElementById("WinnerText").style.color = "#F08000";
    }
    else if((elementPlayer.src.includes('rock') && elementKI.src.includes('scissors')) 
    || (elementPlayer.src.includes('scissors') && elementKI.src.includes('paper')) 
    || (elementPlayer.src.includes('paper') && elementKI.src.includes('rock'))){
        document.getElementById("WinnerText").innerHTML ="Du hast Gewonnen!";
        document.getElementById("WinnerText").style.color = "#008000";
    }
    else if((elementPlayer.src.includes('rock') && elementKI.src.includes('paper')) 
    || (elementPlayer.src.includes('paper') && elementKI.src.includes('scissors')) 
    || (elementPlayer.src.includes('scissors') && elementKI.src.includes('rock'))){
        document.getElementById("WinnerText").innerHTML ="Du hast Verloren!";
        document.getElementById("WinnerText").style.color = "#C70039";
    }
   
}


function changePlayerHand(hand) {
    var elementPlayer = document.getElementById("player");
    switch (hand) {
        case 'rock':
            elementPlayer.src = "./img/rock.png";
            break;
        case 'paper':
            elementPlayer.src = "./img/paper.png";
            break;
        case 'scissors':
            elementPlayer.src = "./img/scissors.png";
            break;
        default:
            break;
    }
}


function changeKIHand(){
    var elementKI = document.getElementById("ki");
    var randomNumber = Math.floor((Math.random() * 3)+1);
    switch (randomNumber) {
        case 1:
            elementKI.src = "./img/rock.png";
            break;
        case 2:
            elementKI.src = "./img/paper.png";
            break;
        case 3:
            elementKI.src = "./img/scissors.png";
            break;
        default:
            break;
    }
}


function resetSelectionHand() {
    elementSelection.style.opacity = 0.5;
    elementSelection.style.transform = 'scale(1)';
}


function startGame(hand) {
        changePlayerHand(hand);
        startShake();
}


function resetGameHand(){
    var elementPlayer = document.getElementById("player");
    var elementKI = document.getElementById("ki");

    elementPlayer.src = "./img/rock.png";
    elementKI.src = "./img/rock.png";
}