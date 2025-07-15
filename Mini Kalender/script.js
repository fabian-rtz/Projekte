document.addEventListener('DOMContentLoaded', function() {
    const date = new Date();
    setCalendar();
   
    function setCalendar(){
        document.getElementById("DayNumber").innerHTML = date.getDate();
        document.getElementById("Day").innerHTML = returnWeekday();
        document.getElementById("Month").innerHTML = returnMonth();
        document.getElementById("Year").innerHTML = date.getFullYear();    
    }
      
    function returnWeekday(){
       const weekDays = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag",
       "Freitag","Samstag"];
       return weekDays[date.getDay()];
    }

    function returnMonth(){
       const allMonth = ["Januar","Februar","März","April","Mai","Juni","Juli","August"
       ,"September","Oktober","November","Dezember"];
       return allMonth[date.getMonth()];
    }
});

