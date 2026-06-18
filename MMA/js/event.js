async function getEventsByYear(year,checkReload){
    showLoader(); 
    if(year){
        if(checkReload){
            let EventSelector = document.getElementById('EventSelector');
            EventSelector.value = localStorage.getItem("year");
        }
   
        localStorage.setItem("year", year);
  
      fetch(`${MMA_API}?action=eventId&year=${encodeURIComponent(year)}`)
        .then(res => res.json())
        .then(data => {     
            setEventsTable(data);    
        });
    }
}

function setEventsTable(data){

    let tableContainer = document.getElementById('table-container');
    let HTML = "";
    

    data.result.forEach(element => {
        HTML += `
        <tr onClick="setEvent(${element.eventId})">
            <td>${element.event}</td>
            <td>${new Date(element.startDate).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                })}</td>
            <td>${new Date(element.endDate).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                })}</td>                                        
        </tr>
        `;
    });
    hideLoader();
    tableContainer.innerHTML = `
            <table class="event-table">
            <thead>
                <tr>
                    <th>Event</th>
                    <th>Start</th>
                    <th>Ende</th>
                </tr>
            </thead>
            <tbody>
                ${HTML}
            </tbody>
        </table>
    `;
}
async function setEvent(eventID){
    const eventMainContainer = document.getElementById('event-main-container');
    const tableContainer = document.getElementById('table-container');
    const EventSelector = document.getElementById('EventSelector');

    tableContainer.style.display = "none";
    EventSelector.style.display = "none";
    showLoader(); 
    const res = await fetch(`${MMA_API}?action=scoreboardByID&eventID=${encodeURIComponent(eventID)}`);
    const data = await res.json();
    const header = data.name;

    const promises = [...data.competitions].reverse().map(async element => {
        const leftResult  = element.competitors[0].winner ? "WIN" : "";
        const rightResult = element.competitors[1].winner ? "WIN" : "";

        const [leftImg, rightImg] = await Promise.all([
            getFighterImgs(element.competitors[0].id),
            getFighterImgs(element.competitors[1].id)
        ]);

        return `
            <div class="fighter-container">
                <div class="left-fighter">
                    <img src="${leftImg}">
                    <div class="info-container">
                        <p class="pWinOrLoss">${leftResult}</p>
                        <p class="pFighterName">${element.competitors[0].athlete.fullName}</p>
                    </div>
                </div>
                <div class="divisionVSContainer">
                    <p class="pDivision">${element.type.abbreviation}</p>
                    <p class="pVS">VS</p>
                </div>
                <div class="right-fighter">
                    <img src="${rightImg}">
                    <div class="info-container">
                        <p class="pWinOrLoss">${rightResult}</p>
                        <p class="pFighterName">${element.competitors[1].athlete.fullName}</p>
                    </div>
                </div> 
            </div>               
        `;
    });

    const HTMLArray = await Promise.all(promises);
    hideLoader(); 
    eventMainContainer.style.display = "flex";
    eventMainContainer.innerHTML = `<h2>${header}</h2>` + HTMLArray.join("");
}

async function getFighterImgs(fighterID){  
    return fetch(`${MMA_API}?action=fighterDetails&fighterId=${encodeURIComponent(fighterID)}`)
        .then(res => res.json())
        .then(data => {
            if(data.fighter_full_detail.athlete.headshot && data.fighter_full_detail.athlete.headshot.href){
                 return data.fighter_full_detail.athlete.headshot.href
            }else{
                if(data.fighter_full_detail.athlete.gender === "FEMALE") {
                    return "../MMA/img/silhouette-headshot-female.png";
                } else {
                     return "../MMA/img/no-profile-image.png";
                }
            }});
}

const selectedEvent = localStorage.getItem("selectedEvent");
if(selectedEvent){
    localStorage.removeItem("selectedEvent");
    setEvent(selectedEvent);
}
else{
    getEventsByYear((localStorage.getItem("year") || "2026"),true);
}

function showLoader() {
    document.querySelector('.lds-ring').style.display = 'inline-block';
}

function hideLoader() {
    document.querySelector('.lds-ring').style.display = 'none';
}
