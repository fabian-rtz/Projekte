let flightSearch = document.getElementById("FlightSearch");

const flights = [
    {
        "start": "Stuttgart (STR)",
        "ziel": "Frankfurt (FRA)",
        "stops": 0,
        "flugdauer": "1h 10m",
        "abflugzeit": "08:20",
        "ankunftszeit": "09:30",
        "preis": {
            "business": "350 EUR",
            "economy": "150 EUR"
        },
        "terminal": "T1"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "Berlin (BER)",
        "stops": 0,
        "flugdauer": "1h 25m",
        "abflugzeit": "10:15",
        "ankunftszeit": "11:40",
        "preis": {
            "business": "400 EUR",
            "economy": "180 EUR"
        },
        "terminal": "T2"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "München (MUC)",
        "stops": 0,
        "flugdauer": "1h 05m",
        "abflugzeit": "07:30",
        "ankunftszeit": "08:35",
        "preis": {
            "business": "370 EUR",
            "economy": "160 EUR"
        },
        "terminal": "T1"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "Hamburg (HAM)",
        "stops": 1,
        "flugdauer": "2h 45m",
        "abflugzeit": "13:10",
        "ankunftszeit": "15:55",
        "preis": {
            "business": "450 EUR",
            "economy": "200 EUR"
        },
        "terminal": "T3"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "Düsseldorf (DUS)",
        "stops": 0,
        "flugdauer": "1h 20m",
        "abflugzeit": "09:50",
        "ankunftszeit": "11:10",
        "preis": {
            "business": "380 EUR",
            "economy": "170 EUR"
        },
        "terminal": "T1"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "Zürich (ZRH)",
        "stops": 0,
        "flugdauer": "1h 10m",
        "abflugzeit": "15:25",
        "ankunftszeit": "16:35",
        "preis": {
            "business": "390 EUR",
            "economy": "180 EUR"
        },
        "terminal": "T2"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "Wien (VIE)",
        "stops": 1,
        "flugdauer": "2h 15m",
        "abflugzeit": "12:40",
        "ankunftszeit": "14:55",
        "preis": {
            "business": "420 EUR",
            "economy": "190 EUR"
        },
        "terminal": "T1"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "Paris (CDG)",
        "stops": 0,
        "flugdauer": "1h 30m",
        "abflugzeit": "06:45",
        "ankunftszeit": "08:15",
        "preis": {
            "business": "430 EUR",
            "economy": "200 EUR"
        },
        "terminal": "T3"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "Amsterdam (AMS)",
        "stops": 0,
        "flugdauer": "1h 35m",
        "abflugzeit": "17:20",
        "ankunftszeit": "18:55",
        "preis": {
            "business": "440 EUR",
            "economy": "210 EUR"
        },
        "terminal": "T2"
    },
    {
        "start": "Stuttgart (STR)",
        "ziel": "Madrid (MAD)",
        "stops": 1,
        "flugdauer": "3h 15m",
        "abflugzeit": "11:10",
        "ankunftszeit": "14:25",
        "preis": {
            "business": "500 EUR",
            "economy": "250 EUR"
        },
        "terminal": "T1"
    }
];

function showFlights(index){  
    const sectionFlight = document.getElementById("sectionFlight");
        sectionFlight.innerHTML += `
            <div class="flightCard">
                <div class="flightInfo">
                    <div class="firstRow">
                        <div>
                            <p class="pDepartureTime">${flights[index].abflugzeit}</p>
                        </div>
                        <div class="lineContainer">
                            <p class="pStopsNumber">${flights[index].stops}</p>
                        </div>
                        <div>
                            <p class="pArrivalTime">${flights[index].ankunftszeit}</p>
                        </div>
                    </div>

                    <div class="secondRow">
                        <div>
                            <p class="pDepartureAirport">${flights[index].start.match(/\((.*?)\)/)[1]}</p>
                        </div>
                        <div>
                            <p class="pStops">Stopp(s)</p>
                        </div>
                        <div>
                            <p class="pArrivalAirport">${flights[index].ziel.match(/\((.*?)\)/)[1]}</p>
                        </div>                    
                    </div>

                    <div class="thirdRow">
                        <p class="pTerminal">${flights[index].terminal}</p>                 
                    </div>

                    <div class="fourthRow">
                        <p class="pFlightLength">Dauer ${flights[index].flugdauer}</p>                
                    </div>            
                </div>

                <div class="FlightClassContainer">
                    <div class="EconomyClass">
                        <div>
                            <p>Economy</p>
                            <p>ab</p>
                            <p>${flights[index].preis.economy}</p>
                            <p>EUR</p>
                        </div>
                        <img src="img/arrow-down.png" alt="">
                    </div>

                    <div class="BusinessClass">
                        <div>
                            <p>Business</p>
                            <p>ab</p>
                            <p>${flights[index].preis.business}</p>
                            <p>EUR</p>
                        </div>
                        <img src="img/arrow-down.png" alt="">
                    </div>
                </div>
            </div>
        `;
}


flightSearch.addEventListener("click", ()=>{
    sectionFlight.innerHTML = "";

    if (inputFromAirport.value.trim() !== "") {

        flights.forEach((flight, index) => {


            let matchFrom = flight.start.toLowerCase().includes(inputFromAirport.value.toLowerCase());

            let matchTo = true; 

            if (inputToAirport.value.trim() !== "") {

                matchTo = flight.ziel.toLowerCase().includes(inputToAirport.value.toLowerCase());
            }

            if (matchFrom && matchTo) {
                showFlights(index);
            }
        });

        sectionFlight.style.display = "flex";
    }
    else {
        alert("Bitte ein Flughafen eintragen !");
    }
});
   
