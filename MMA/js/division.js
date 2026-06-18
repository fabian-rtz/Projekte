function loadRankingsfromAPI() {
    const cachedData = localStorage.getItem('mma_cache');

    if (cachedData) {
        loadRankings(JSON.parse(cachedData));
    }
    fetch(`${MMA_API}?action=rankings`)
        .then(res => res.json())
        .then(data => {
            const oldData = localStorage.getItem('mma_cache');
               
            if (JSON.stringify(data) !== oldData) {
                localStorage.setItem('mma_cache', JSON.stringify(data));
                localStorage.removeItem('fighter_ids')
                loadRankings(data); 
            }
        });
}

async function loadRankings(data){ 
    showLoader(); 
    
    let detailsContainer = document.getElementById('details-container');

    let cachedIDs = JSON.parse(localStorage.getItem('fighter_ids'));

    if (!cachedIDs) {
        const fighters = data.filter(e => e.division && /^\d/.test(e.division));
        cachedIDs = await Promise.all(fighters.map(f => getFighterID(f.division)));
        localStorage.setItem('fighter_ids', JSON.stringify(cachedIDs));
    }

    const Favouriteimgs = await Promise.all(cachedIDs.map(id => getFavouriteFighter(id)));

    let fighterIndex = 0;

    const promise = data.map(async element => {
        if (!/^\d/.test(element.division) && element.division) {
            return `
            </details>
            <details>
                <summary> ${element.division}</summary>
            `;
        } else {
            if(element.division){
                const fighterID = cachedIDs[fighterIndex];
                const favouriteFighterImg = Favouriteimgs[fighterIndex];
                fighterIndex++;
            return `
            <div class="FighterContainer">
                <p>${element.division}</p>
                ${istEingeloggt ? `<button onClick="setFavouriteFighter(${fighterID})"><img class="favouriteImg" src="${favouriteFighterImg}"></button>` : ""}
            </div>
            `;
            }
        }
        return "";
    });
    hideLoader(); 
    const HTMLArray = await Promise.all(promise); 
    detailsContainer.innerHTML = HTMLArray.join("");
}


async function setFavouriteFighter(fighterID){ 
    if(istEingeloggt){
        const button = document.querySelector(`button[onclick="setFavouriteFighter(${fighterID})"]`);
            const favouriteImg = button.querySelector('.favouriteImg');

            let formData = new FormData();
            formData.append('fighter_id', fighterID);

            if (favouriteImg.getAttribute('src').includes("favourite_black.png")) {
                await fetch(`${DB_API}?action=setFavouriteFighter`, {
                    method: "POST",
                    body: formData
                });
                favouriteImg.src = "../MMA/img/favourite_red.png";
            } else {
                await fetch(`${DB_API}?action=deleteFavouriteFighter&fighterId=${fighterID}`, {
                    method: "POST",
                    body: formData
                });
                favouriteImg.src = "../MMA/img/favourite_black.png";
            }
    } 
}
async function getFighterID(fighter) {
    let fighterName = fighter.replace(/^\d+\.\s*/, '').split(',')[0].trim();

    const res = await fetch(`${MMA_API}?action=search&player=${fighterName}`);
    const data = await res.json();
    return Object.values(data.players).flatMap(element => element.playerId);
}

async function getFavouriteFighter(fighter_id){
    let favouriteImg = "";

    return fetch(`${DB_API}?action=getFavouriteFighter&fighterId=${fighter_id}`)
        .then(res => res.json())
        .then(data => {    
            if(data){           
                favouriteImg = "../MMA/img/favourite_red.png";    
            }
            else{ 
                favouriteImg = "../MMA/img/favourite_black.png";               
            }
            return favouriteImg;
        })
        .catch(error => {
            console.error("Fehler:", error);
        });
}

function showLoader() {
    document.querySelector('.lds-ring').style.display = 'inline-block';
}

function hideLoader() {
    document.querySelector('.lds-ring').style.display = 'none';
}

loadRankingsfromAPI();

