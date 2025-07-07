function setData() {
    let inputBirthDate = {
        Bd: new Date(document.getElementById("Age").value).getDate(),
        Bm: new Date(document.getElementById("Age").value).getMonth(),
        By: new Date(document.getElementById("Age").value).getFullYear()
    };

    let currentDate = new Date(); 

    let dateToday = {
        Td: currentDate.getDate(),
        Tm: currentDate.getMonth(),
        Ty: currentDate.getFullYear(),
    };  

    Calculate(dateToday, inputBirthDate);   
}

function Calculate(dateToday, inputBirthDate) {
    if (new Date(inputBirthDate.By, inputBirthDate.Bm, inputBirthDate.Bd) <= new Date()) {
        document.getElementById("AgeText").innerHTML = `Du bist ${dateToday.Ty - inputBirthDate.By} Jahre, ${dateToday.Tm - inputBirthDate.Bm} Monate, ${dateToday.Td - inputBirthDate.Bd} Tage alt`;
    } else {
        alert("Bitte gültiges Datum eingeben!");
    }
}