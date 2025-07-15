let timer = null;
let [sec,min,hours] = [0,0,0];
let h;
let m;
let s;

function stopwatch(){
    let time = document.getElementById('time');
    sec++;
    if(sec == 60){
        sec = 0;
        min++
        if(min == 60){
            hours++;
        }
    }
     h = hours < 10 ? "0" + hours : hours;
     m = min < 10 ? "0" + min : min;
     s = sec < 10 ? "0" + sec : sec;
    time.innerHTML = h + ":" + m + ":" + s;
}


function Play(){
   timer = setInterval(stopwatch,1000);
}

function Pause(){
    clearInterval(timer);
}

function Stop(){
    clearInterval(timer);
    [sec,min,hours] = [0,0,0];
    time.innerHTML = "00:00:00";
}