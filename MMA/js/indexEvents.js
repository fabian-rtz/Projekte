async function loadScheduledEvents(OptionValue) {
    let container = document.getElementById('events-inner-container');
    container.innerHTML = "";

    showLoader(); 

    const res = await fetch(`${MMA_API}?action=schedule`);
    const data = await res.json();

    const promises = Object.values(data).flatMap(elementGroup => {  
        return elementGroup.map(async (element) => {     

            if (OptionValue == 'Upcoming') {
                if (!element.completed) {
                    return await getEventByID(element.id);  
                } else {
                    return "";
                }
            } else {
                return await getEventByID(element.id);
            }

        });
    });

    const HTMLArray = await Promise.all(promises);

    hideLoader(); 
    setEvent(HTMLArray);

}
async function getEventByID(eventsID) {
    const res = await fetch(`${MMA_API}?action=scoreboardByID&eventID=${eventsID}`);
    const data = await res.json();


    if(!data.competitions){
        return "";
    }

    const last = data.competitions[data.competitions.length - 1];

    const [img1, img2] = await Promise.all([
            getFighterImgs(last.competitors[0].id),
            getFighterImgs(last.competitors[1].id)
        ]);


    const eventDate = new Date(data.date).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    
    return `
        <div class="event-outer-container">
            <div class="event-header-container">
                <h2>${data.name}</h2>
                <h3>${eventDate} UHR</h3>
            </div>
            <div class="event" onClick="goToEvents(${data.id})">       
                <div class="fighter1-main-container">
                    <img src="${img1}" alt="" draggable="false">
                    <div class="fighter1-info-container">
                        <p class="pFighterName">${last.competitors[0].athlete.fullName}</p>
                    </div>
                </div>
                <p class="pVS">VS</p>
                <div class="fighter2-main-container">
                    <img src="${img2}" alt="" draggable="false">
                    <div class="fighter2-info-container">
                        <p class="pFighterName">${last.competitors[1].athlete.fullName}</p>
                    </div>      
                </div>  
            </div>
        </div>
        <hr>
    `;
}

function goToEvents(eventID){
    localStorage.setItem("selectedEvent", eventID);
    window.location.href = "../MMA/event.php";
}

function setEvent(HTML){
    let container = document.getElementById('events-inner-container');
   container.innerHTML = HTML.join('');
}

async function getFighterImgs(fighterID) {
    const res = await fetch(`${MMA_API}?action=fighterDetails&fighterId=${encodeURIComponent(fighterID)}`);
    const data = await res.json();
    
    let headshotSrc; 
    
    if (data.fighter_full_detail.athlete.gender === "FEMALE") {
        headshotSrc = "../MMA/img/silhouette-headshot-female.png";
    } else {
        headshotSrc = "../MMA/img/no-profile-image.png";
    }
    
    return data.fighter_full_detail.athlete.headshot 
        ? data.fighter_full_detail.athlete.headshot.href 
        : headshotSrc;
}

function showLoader() {
    document.querySelector('.lds-ring').style.display = 'inline-block';
}

function hideLoader() {
    document.querySelector('.lds-ring').style.display = 'none';
}


loadScheduledEvents('All');