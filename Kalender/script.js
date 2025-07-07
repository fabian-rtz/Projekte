  const container = document.getElementById("daysNumber");

    const year = 2025;
    const month = 5; 
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const heute = new Date();        // aktuelles Datum
    const tag = heute.getDate();   
    const offset = (firstDay + 6) % 7; 
    console.log(tag);
    let html = "";
    let index = 0;


    if(daysInMonth == 30){    
        for (let i = 1; i <= daysInMonth + 5; i++) {   
                 
                 if(i === tag+1){
                     html += `<p class="ptoday">${i}</p>`; 
                 }
                 if(i > daysInMonth){
                    html += `<p></p>`; 
                 }
                 else{
                    html += `<p>${i}</p>`; 
                 }       
        }
    }

    else if(daysInMonth == 31){
        for (let i = 1; i <= daysInMonth + 4; i++) {
            if(i === tag+1){
                     html += `<p class="ptoday">${i}</p>`; 
                 }
                 if(i > daysInMonth){
                    html += `<p></p>`; 
                 }
                 else{
                    html += `<p>${i}</p>`; 
                 }       
        }
    }
    else{
        for (let i = 1; i <= daysInMonth; i++) {
             if(i === tag+1){
                    html += `<p class="ptoday">${i}</p>`; 
                 }
                 if(i > daysInMonth){
                    html += `<p></p>`; 
                 }
                 else{
                    html += `<p>${i}</p>`; 
                 }       
        }
    }





    container.innerHTML = html;