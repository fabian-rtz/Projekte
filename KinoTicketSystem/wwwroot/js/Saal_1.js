async function fetchSeats() {
    document.getElementById('hallname').textContent = `Saal ${localStorage.getItem('selectedHallID')}`
    document.getElementById('filmname').textContent = localStorage.getItem('selectedMovie');
    document.getElementById('datetime').textContent = `${localStorage.getItem('selectedDate')} ${localStorage.getItem('selectedTime')}` 
    const hallId = localStorage.getItem('selectedHallID'); // hallId aus dem Speicher holen
    if (!hallId) {
        console.error("Keine HallId gefunden");
        return;
    }

    try {
        let response = await fetch(`/api/seats?hallId=${hallId}`, { 
            method: "GET", 
            headers: { "Accept": "application/json" } 
        });

        if (!response.ok) throw new Error("Fehler beim Laden der Sitzplätze");

        let parsedResponse = await response.json();
        let seats = parsedResponse.$values || [];
        renderSeats(seats);
    } catch (error) {
        console.error("Fehler beim Abrufen der Sitzplätze:", error);
    }
}

function renderSeats(seats) {
    const rowColors = {
        "A": "rgb(255,208,61)", 
        "B": "rgb(255,208,61)",
        "C": "rgb(232,41,163)", 
        "D": "rgb(232,41,163)", 
        "E": "rgb(232,41,163)",
        "F": "rgba(0,0,255,0.5)", 
        "G": "rgba(0,0,255,0.5)", 
        "H": "rgba(0,0,255,0.5)"
    };

    let groupedRows = seats.reduce((acc, seat) => {
        (acc[seat.row] = acc[seat.row] || []).push(seat);
        return acc;
    }, {});

    document.getElementById("seat-container").innerHTML = Object.entries(groupedRows)
        .map(([rowLetter, rowSeats]) => generateRowHTML(rowLetter, rowSeats, rowColors[rowLetter]))
        .join("");
}

function generateRowHTML(rowLetter, seats, color) {
    let leftSeats = seats.slice(0, 3);
    let rightSeats = seats.slice(3, 17);

    return `
        <div class="row" id="row-${rowLetter}">
            <div class="left-side">${leftSeats.map(seat => generateSeatHTML(seat, color)).join("")}</div>
            <div class="spacebetween"></div>
            <div class="right-side">${rightSeats.map(seat => generateSeatHTML(seat, color)).join("")}</div>
            <p class="rowLetter">${rowLetter}</p>
        </div>
    `;
}

function generateSeatHTML(seat, color) {
    return `
        <div class="seat ${(seat.status === 1 || seat.status === 2) ? 'occupied' : ''}" 
             id="seat-${seat.id}" 
             style="background-color: ${(seat.status === 1 || seat.status === 2) ? 'gray' : color};"
             onclick="toggleSeatSelection(${seat.id}, ${seat.status})">

        </div>
    `;
}


let selectedSeats = [];
let selectedSeatsID = [];

async function toggleSeatSelection(seatId, status) {
    if (status !== 0) return;
   

    let seat = document.getElementById(`seat-${seatId}`);
    if (!seat) return;

    let seatData = await getSeatInfo(seatId);
    let seatNumber = `${seatData.row}${seatData.seatNumber}`;

    if (seat.classList.contains("selected")) {
        await cancelSeatReservation(seatId);
        seat.classList.remove("selected");
        seat.innerHTML = "";
        selectedSeats = selectedSeats.filter(s => s !== seatNumber);
        selectedSeatsID = selectedSeatsID.filter(id => id !== seatId);
        console.log("sS",selectedSeats); 
        console.log("sSID",selectedSeatsID); 
        console.log("Test");
    } else {
        seat.classList.add("selected");
        seat.innerHTML = '<img src="../img/user.png" alt="Selected">';
        selectedSeats.push(seatNumber);
        selectedSeatsID.push(seatId);
        console.log("sS",selectedSeats); 
        console.log("sSID",selectedSeatsID); 
        await reserveSeatTemp(seatId);
    }

    startCountdown();
    updateTicketSummary();
}

let interval;
function startCountdown() {
    clearInterval(interval);
    let display = document.getElementById("reservMin");
    let timer = 15;

    interval = setInterval(() => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;
        display.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        if (--timer < 0) {
            clearInterval(interval);
            display.textContent = "";
            location.reload();
        }
    }, 1000);
}

async function reserveSeatTemp(seatId, isTemporary = true) {
    try {
        let userData = JSON.parse(localStorage.getItem('UserData') || "{}");
        let requestBody = JSON.stringify({ 
            seatId, 
            isTemporary,
            userId: userData.id  // Stelle sicher, dass `userId` richtig geschrieben ist!
        });

        console.log("🔹 Sende Reservierungsanfrage:", requestBody);

        let response = await fetch("/api/seats/reserve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: requestBody
        });

        let responseText = await response.text();
        console.log("🔸 API Antwort:", response.status, responseText);

        if (!response.ok) {
            throw new Error(`Reservierung fehlgeschlagen: ${response.status} - ${responseText}`);
        }

        let data = JSON.parse(responseText);
        console.log("✅ Reservierung erfolgreich:", data);
    } catch (error) {
        console.error("❌ Fehler bei der Reservierung:", error);
    }
}

async function cancelSeatReservation(seatId) {
    try {
        let userData = JSON.parse(localStorage.getItem('UserData') || "{}");
        if (!userData.id) {
            console.error("Kein gültiger Benutzer gefunden.");
            return;
        }
        let requestBody = JSON.stringify({ seatId, userId: userData.id });
        let response = await fetch("/api/seats/cancelReservation", { 
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: requestBody
        });
        if (!response.ok) {
            throw new Error(`Fehler beim Aufheben der Reservierung: ${response.status} - ${await response.text()}`);
        }
        // Optional: UI aktualisieren, z.B. Sitzfarbe neu rendern
        console.log("Reservierung erfolgreich aufgehoben.");
        // Danach evtl. fetchSeats() neu laden
        fetchSeats();
    } catch (error) {
        console.error("Fehler beim Aufheben der Reservierung:", error);
    }
}

function updateTicketSummary() {
    let totalTickets = document.querySelectorAll(".seat.selected").length;
    let totalPrice = [...document.querySelectorAll(".seat.selected")].reduce((sum, seat) => {
        let color = seat.style.backgroundColor.trim().replace(/\s+/g, "");
        return sum + (color === "rgba(0,0,255,0.5)" ? 10.5 : color === "rgb(232,41,163)" ? 10.5 : 11.5);
    }, 0);

    document.getElementById("ticket-count").textContent = `${totalTickets} Tickets`;
    document.getElementById("total-price").textContent = `${totalPrice.toFixed(2)} €`;
}

async function redirectToSummary() {
    localStorage.setItem('reservedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('reservedSeatsID', JSON.stringify(selectedSeatsID));

    let ticketCount = document.getElementById("ticket-count").textContent.replace(" Tickets", "").trim();
    let selectionInfo = document.getElementById("SelectionInfo");

    if (ticketCount === "0") {
        selectionInfo.classList.add("warning");
    } else {
        window.location.href = "../html/Saal_1_Summary.html";
    }
}

async function getSeatInfo(seatId) {
    try {
        let response = await fetch(`/api/seats?hallId=${localStorage.getItem("selectedHallID")}`);
        let parsedResponse = await response.json();
        return parsedResponse.$values.find(seat => seat.id === seatId) || {};
    } catch (error) {
        console.error("Fehler beim Abrufen der Sitzplatzdaten:", error);
        return {};
    }
}

fetchSeats();
