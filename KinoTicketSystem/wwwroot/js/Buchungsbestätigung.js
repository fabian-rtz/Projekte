document.addEventListener("DOMContentLoaded", function () {
    console.log(localStorage.getItem("selectedMovieID"));
    fetchMovieById(localStorage.getItem("selectedMovieID"));
});

async function fetchMovieById(movieId) {
    try {
        let response = await fetch(`/api/movies/${movieId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            console.error(`Fehler beim Abrufen des Films: ${response.status} ${response.statusText}`);
            return null;
        }

        let movieData = await response.json();
        let shows = movieData.shows.$values || [];

        let selectedShow = shows.find(show => show.id.toString() === localStorage.getItem("selectedShowID"));
        console.log(shows);
        if (selectedShow) {
            setContactInfoLocalStorage(selectedShow.time, selectedShow.date);
        }

        console.log("Geladener Film:", movieData);
        return movieData;
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return null;
    }
}

function formatGermanDate(dateString) {
    return new Date(dateString).toLocaleDateString("de-DE", { day: "numeric", month: "numeric", year: "numeric" });
}

function setTextContent(elementId, text) {
    let element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    } else {
        console.warn(`Element mit der ID ${elementId} nicht gefunden.`);
    }
}

function setContactInfoLocalStorage(showtime,showdate) {

    let contactInfo = JSON.parse(localStorage.getItem('ContactInfo')) || {};
    let { vorname = "", Nachname = "", email = "", Straße = "", Hausnummer = "", PLZ = "", Ort = "" } = contactInfo;

    let selectedSeats = JSON.parse(localStorage.getItem("reservedSeats")) || [];

    let formattedTime = `${showtime.substring(0, 5)} Uhr`;
    let formattedDate = formatGermanDate(showdate);
    let formattedDateTime = `${formattedTime} ${formattedDate}`;

     // Kontaktinformationen anzeigen
    setTextContent('name', `${vorname} ${Nachname}`);
    setTextContent('nameTicket', `${vorname} ${Nachname}`);
    setTextContent('email', email);
    setTextContent('straße', `${Straße} ${Hausnummer}`);
    setTextContent('ort', `${PLZ} ${Ort}`);

    // Zeit und Datum anzeigen
    setTextContent('time', formattedTime);
    setTextContent('date', formattedDate);
    setTextContent('timedateTicket', formattedDateTime);

    // Sitzplätze anzeigen
    setTextContent('seat', selectedSeats.join(", "));
    setTextContent('seatTicket', selectedSeats.join(", "));

    // Saal und Filminformationen anzeigen
    let selectedHall = localStorage.getItem("selectedHallID");
    let selectedMovie = localStorage.getItem("selectedMovie");

    setTextContent('hall', `Saal ${selectedHall}`);
    setTextContent('hallTicket', `Saal ${selectedHall}`);
    setTextContent('filmname', selectedMovie);
    setTextContent('filmnameTicket', selectedMovie);
}





