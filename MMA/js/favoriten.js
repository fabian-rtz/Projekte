let FighterIDArray = [];

async function getFavouriteFighter(){
    showLoader();
    
    return fetch(`${DB_API}?action=getAllFavouriteFighters`)
        .then(res => res.json())
        .then(data => {setFavouriteFighter(data); })
        .catch(error => {
            console.error("Fehler:", error);
        });
}

async function getScheduledFights(){      
    const eventIDs = [];
        return fetch(`${MMA_API}?action=schedule`)
        .then(res => res.json())
        .then(data => { Object.values(data).forEach(events => {
                events.forEach(event => {              
                    if(!event.completed)
                    eventIDs.push({
                        id: event.id,
                    });
                });
            });
            return getEventByID(eventIDs);
        })
        .catch(error => {
            console.error("Fehler:", error);
        });
}


async function getEventByID(eventIDs) {
    FighterIDArray = [];

    const promises = eventIDs.map(element => 
        fetch(`${MMA_API}?action=scoreboardByID&eventID=${element.id}`)
            .then(res => res.json())
            .then(data => {
                if(!data || !data.competitions) return; 
                Object.values(data.competitions).forEach(comp => {
                    FighterIDArray.push(comp.competitors[0].id);
                    FighterIDArray.push(comp.competitors[1].id);
                });
            })
            .catch(error => console.error("Fehler:", error))
    );

    await Promise.all(promises);
}

async function setFavouriteFighter(data){
    await getScheduledFights();

    let tableContainer = document.getElementById('table-container');
    let HTML = "";

    if(data){
        const promises = data.map(element => 
            fetch(`${MMA_API}?action=fighterDetails&fighterId=${element.Fighter_ID}`)
                .then(res => res.json())
                .then(fighterdata => {
                    if(!fighterdata.fighter_full_detail?.eventsMap) return ""; 
                    const events = Object.values(fighterdata.fighter_full_detail.eventsMap);
                    const UpcomingFightImg = FighterIDArray.includes(String(element.Fighter_ID)) 
                    ? "./img/boxing-gloves.png" 
                    : "";
                    return `
                        <tr">
                            <td class="fighterInfo">
                                <img onClick="goToStats(${element.Fighter_ID},'${fighterdata.fighter_full_detail.athlete.fullName}')" class="fighterImg" src="${fighterdata.fighter_full_detail.athlete.headshot.href}" alt="JJ"> 
                                ${fighterdata.fighter_full_detail.athlete.fullName}
                                <img class="UpcomingFightImg" src="${UpcomingFightImg}">
                            </td>
                            <td>${fighterdata.fighter_full_detail.athlete.weightClass.shortName}</td>
                            <td>${fighterdata.fighter_full_detail.athlete.statsSummary.statistics[0].displayValue}</td>
                            <td>(${events[0].gameResult}) ${events[0].name}</td>
                            <td><button onClick="deleteFavouriteFighter(${element.Fighter_ID})"><img src="./img/trash.png"></button></td>
                        </tr>            
                    `;
                })
                .catch(error => { console.error("Fehler:", error); return ""; })
        );

        
        const HTMLArray = await Promise.all(promises);
        HTML = HTMLArray.join("");
    }
    hideLoader();
    tableContainer.innerHTML = `
        <table class="favourite-table">
            <thead>
                <tr>
                    <th>Kämpfer</th>
                    <th>Division</th>
                    <th>Record</th>
                    <th>Letzter Kampf</th>
                    <th>Aktion</th>
                </tr>
            </thead>
            <tbody>  
              ${HTML}
            </tbody>
        </table> 
    `;
}


async function deleteFavouriteFighter(fighterID){
    let formData = new FormData();
        formData.append('fighter_id', fighterID);

        await fetch(`${DB_API}?action=deleteFavouriteFighter&fighterId=${fighterID}`, {
            method: "POST",
            body: formData
        });

    getFavouriteFighter();
}

function goToStats(id,name){
    localStorage.setItem("selectedFighter", JSON.stringify({ id: id, name: name }));
    window.location.href = "../MMA/statistiken.php";
}

function showLoader() {
    document.querySelector('.lds-ring').style.display = 'inline-block';
}

function hideLoader() {
    document.querySelector('.lds-ring').style.display = 'none';
}


getFavouriteFighter();
