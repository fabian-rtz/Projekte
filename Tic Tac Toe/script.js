var playerItem;

function placeItem(spannumber){
    CheckPlayer();
    
    switch (spannumber) {
        case '1':
            setField(1,1);
            checkWinner();
            break;
        case '2':
            setField(1,2);  
            checkWinner();      
            break;
        case '3':
            setField(1,3);   
            checkWinner()
            break;
        case '4':
            setField(2,1); 
            checkWinner()
            break;
        case '5':
            setField(2,2); 
             checkWinner()  
            break;
        case '6':
            setField(2,3);  
            checkWinner()
            break;
        case '7':
            setField(3,1); 
            checkWinner()
            break;
        case '8':
            setField(3,2);
            checkWinner()
            break;
        case '9':
            setField(3,3); 
            checkWinner()
            break;           
        default:
            break;
    }
}

function setField(rownumber, childnumber){
    var selector = `.row${rownumber} span:nth-child(${childnumber})`;     
    var element = document.querySelector(selector);
    element.textContent = playerItem;
    element.style.pointerEvents = 'none';
    element.style.userSelect = 'none';
}

function CheckPlayer() {
    var backgroundElement = document.querySelector('.players .background');
    var transformValue = backgroundElement.style.transform;
    var firstPlayer = document.querySelector('.players span:nth-child(2)');
    var secondPlayer = document.querySelector('.players span:nth-child(3)');
    
    // Überprüfen, ob transformValue 'translateX(50%)' enthält
    if (transformValue.includes('translateX(50%)')) {
        playerItem = "O";
        backgroundElement.style.transform = 'translateX(-50%)'; 
        firstPlayer.style.color = 'white';
        secondPlayer.style.color = '#56baed';

    } else {
        playerItem = "X";
        backgroundElement.style.transform = 'translateX(50%)'; 
        firstPlayer.style.color = '#56baed';
        secondPlayer.style.color = 'white';
    }
}

function checkWinner(){
    
    CheckXWinner();
    CheckOWinner();
  

}
function CheckXWinner(){
    if(document.querySelector('.row1 span:nth-child(1)').textContent =='X' 
    && document.querySelector('.row1 span:nth-child(2)').textContent =='X'
    && document.querySelector('.row1 span:nth-child(3)').textContent =='X'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.transform = 'translateY(-212px)';
        setWinner('Du hast gewonnen!');
    }
    if(document.querySelector('.row2 span:nth-child(1)').textContent =='X' 
    && document.querySelector('.row2 span:nth-child(2)').textContent =='X'
    && document.querySelector('.row2 span:nth-child(3)').textContent =='X'){
        document.getElementById("WinnerLine").style.opacity = 1;
        setWinner('Du hast gewonnen!');
    }
    if(document.querySelector('.row3 span:nth-child(1)').textContent =='X' 
    && document.querySelector('.row3 span:nth-child(2)').textContent =='X'
    && document.querySelector('.row3 span:nth-child(3)').textContent =='X'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.transform = 'translateY(208px)';
        setWinner('Du hast gewonnen!');
    }
    if(document.querySelector('.row1 span:nth-child(1)').textContent =='X' 
    && document.querySelector('.row2 span:nth-child(1)').textContent =='X'
    && document.querySelector('.row3 span:nth-child(1)').textContent =='X'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate  = '90deg';
        document.getElementById("WinnerLine").style.transform = 'translateY(208px)';
        setWinner('Du hast gewonnen!');
    }
    if(document.querySelector('.row1 span:nth-child(2)').textContent =='X' 
    && document.querySelector('.row2 span:nth-child(2)').textContent =='X'
    && document.querySelector('.row3 span:nth-child(2)').textContent =='X'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate  = '90deg';
        setWinner('Du hast gewonnen!');
    }
    if(document.querySelector('.row1 span:nth-child(3)').textContent =='X' 
    && document.querySelector('.row2 span:nth-child(3)').textContent =='X'
    && document.querySelector('.row3 span:nth-child(3)').textContent =='X'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate  = '90deg';
        document.getElementById("WinnerLine").style.transform = 'translateY(-212px)';
        setWinner('Du hast gewonnen!');
    }
    if(document.querySelector('.row1 span:nth-child(1)').textContent =='X' 
    && document.querySelector('.row2 span:nth-child(2)').textContent =='X'
    && document.querySelector('.row3 span:nth-child(3)').textContent =='X'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate  = '45deg';
        document.getElementById("WinnerLine").style.width = '600px'; 
        setWinner('Du hast gewonnen!');
    }
    if(document.querySelector('.row1 span:nth-child(3)').textContent =='X' 
    && document.querySelector('.row2 span:nth-child(2)').textContent =='X'
    && document.querySelector('.row3 span:nth-child(1)').textContent =='X'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate= '-45deg';
        document.getElementById("WinnerLine").style.width = '600px';
        setWinner('Du hast gewonnen!');
    }
}





function CheckOWinner(){
    if(document.querySelector('.row1 span:nth-child(1)').textContent =='O' 
    && document.querySelector('.row1 span:nth-child(2)').textContent =='O'
    && document.querySelector('.row1 span:nth-child(3)').textContent =='O'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.transform = 'translateY(-212px)';
        setWinner('Du hast verloren!');
    }
    if(document.querySelector('.row2 span:nth-child(1)').textContent =='O' 
    && document.querySelector('.row2 span:nth-child(2)').textContent =='O'
    && document.querySelector('.row2 span:nth-child(3)').textContent =='O'){
        document.getElementById("WinnerLine").style.opacity = 1;
        setWinner('Du hast verloren!');
    }
    if(document.querySelector('.row3 span:nth-child(1)').textContent =='O' 
    && document.querySelector('.row3 span:nth-child(2)').textContent =='O'
    && document.querySelector('.row3 span:nth-child(3)').textContent =='O'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.transform = 'translateY(208px)';
        setWinner('Du hast verloren!');
    }
    if(document.querySelector('.row1 span:nth-child(1)').textContent =='O' 
    && document.querySelector('.row2 span:nth-child(1)').textContent =='O'
    && document.querySelector('.row3 span:nth-child(1)').textContent =='O'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate  = '90deg';
        document.getElementById("WinnerLine").style.transform = 'translateY(208px)';
        setWinner('Du hast verloren!');
    }
    if(document.querySelector('.row1 span:nth-child(2)').textContent =='O' 
    && document.querySelector('.row2 span:nth-child(2)').textContent =='O'
    && document.querySelector('.row3 span:nth-child(2)').textContent =='O'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate  = '90deg';
        setWinner('Du hast verloren!');
    }
    if(document.querySelector('.row1 span:nth-child(3)').textContent =='O' 
    && document.querySelector('.row2 span:nth-child(3)').textContent =='O'
    && document.querySelector('.row3 span:nth-child(3)').textContent =='O'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate  = '90deg';
        document.getElementById("WinnerLine").style.transform = 'translateY(-212px)';
        setWinner('Du hast verloren!');
    }
    if(document.querySelector('.row1 span:nth-child(1)').textContent =='O' 
    && document.querySelector('.row2 span:nth-child(2)').textContent =='O'
    && document.querySelector('.row3 span:nth-child(3)').textContent =='O'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate  = '45deg';
        document.getElementById("WinnerLine").style.width = '600px'; 
        setWinner('Du hast verloren!');
    }
    if(document.querySelector('.row1 span:nth-child(3)').textContent =='O' 
    && document.querySelector('.row2 span:nth-child(2)').textContent =='O'
    && document.querySelector('.row3 span:nth-child(1)').textContent =='O'){
        document.getElementById("WinnerLine").style.opacity = 1;
        document.getElementById("WinnerLine").style.rotate= '-45deg';
        document.getElementById("WinnerLine").style.width = '600px';
        setWinner('Du hast verloren!');
    }
}
function setWinner(msg){
    console.log(msg);    
    var spans = document.querySelectorAll('.Gamefield span');
    spans.forEach(function(span) {
        span.style.pointerEvents = 'none'; // Hier solltest du 'span' verwenden, nicht 'spans'
    });
}