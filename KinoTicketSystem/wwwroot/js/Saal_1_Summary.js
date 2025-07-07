function toggleDiv() {
    let radioButton = document.getElementById('radio');
    let mastercardPaymentDiv = document.getElementsByClassName('Mastercard-Payment')[0];
    let inputs = mastercardPaymentDiv.querySelectorAll('input'); 
    
    radioButton.addEventListener('change', function () {
        if (radioButton.checked) {       
            mastercardPaymentDiv.style.display = 'flex'; 
            inputs.forEach(input => input.disabled = false); 
        } else {    
            mastercardPaymentDiv.style.display = 'none'; 
            inputs.forEach(input => input.disabled = true); 
        }
    });
}
async function redirectToSummary(event) {
    event.preventDefault();
    let reservedSeatsID = JSON.parse(localStorage.getItem('reservedSeatsID')) || []; 
   
    let form = event.target;
    
    if (form.checkValidity()) {
        for (let i = 0; i < reservedSeatsID.length; i++) {
            await reserveSeatPerm(reservedSeatsID[i]);  
            console.log("Test");
        } 
        
        parseContactInfoLocalStorage();
        window.location.href = "./Buchungsbestätigung.html"; 
    } else {  
        form.reportValidity(); 
    }
}

async function reserveSeatPerm(seatId, isTemporary = false) {
   
    let userData = localStorage.getItem('UserData');
    let userID = userData ? JSON.parse(userData).id : null;

    try {
        let numericSeatId = parseInt(seatId, 10);
        
        if (isNaN(numericSeatId)) {
            console.error("Fehler: Sitzplatz-ID ist keine gültige Zahl!", seatId);
            return;
        }
        
        console.log(userID);
        let requestBody = JSON.stringify({ 
            seatId: numericSeatId, 
            isTemporary,
            userID});

        console.log("Sende Reservierungsanfrage mit Body:", requestBody);

        let response = await fetch("/api/seats/reserve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requestBody
        });

        if (!response.ok) {
            let errorText = await response.text();
            throw new Error(`Reservierung fehlgeschlagen: ${response.status} - ${errorText}`);
        }

        let data = await response.json();
        console.log("Reservierung erfolgreich:", data);
    } catch (error) {
        console.error("Fehler bei der Reservierung:", error);
    }
}

function parseContactInfoLocalStorage(){

    let ContactInfo = {
        vorname: document.getElementById('vorname').value,
        Nachname:document.getElementById('Nachname').value,
        Benutzername:document.getElementById('Benutzername').value,
        email:document.getElementById('email').value ,
        PLZ:document.getElementById('PLZ').value,
        Ort:document.getElementById('Ort').value,
        Straße:document.getElementById('Straße').value,
        Hausnummer:document.getElementById('Hausnummer').value
    };
    localStorage.setItem("ContactInfo", JSON.stringify(ContactInfo));

}


