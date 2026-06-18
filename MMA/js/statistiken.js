let currentLeftFighterId = null;
let currentRightFighterId = null;

let FighterIDArrayRight = [];
let FighterIDArrayLeft = [];

function safe(value) {
    if (value === undefined || value === null || value === "") {
        return "Nicht Vorhanden";
    }
    return value;
}

function loadStatsFromPlayerID(playerID) {
    return fetch(`${MMA_API}?action=fighterDetails&fighterId=${playerID}`)
        .then(res => res.json())
        .then(data => { return data; })
        .catch(error => {
            console.error("Fehler:", error);
        });
}

function searchPlayer(player, side) {
    fetch(`${MMA_API}?action=search&player=${encodeURIComponent(player)}`)
        .then(res => res.json())
        .then(data => setListFighter(data, side))
        .catch(error => console.error("Fehler bei der Suche:", error));
}

function setListFighter(data, side) {
    let searchContainer = document.getElementById(`${side}-search-container`);
    searchContainer.innerHTML = "";

    if (data.success && data.players && data.players.length > 0) {
        let HTML = "";
        data.players.forEach(element => {
            HTML += `
            <div class="search-item" onclick="setFighterStats('${element.playerId}', '${element.displayName}', '${side}')">
                <p>${element.displayName}</p>
                <hr>
            </div>`;
        });
        searchContainer.innerHTML = HTML;
    } else {
        searchContainer.innerHTML = "<p>Kein Kämpfer gefunden.</p>";
    }
}

function setStatsLeft(leftdata) {
    let favouriteButtonLeft = document.getElementById('favourite-btn-left');
    if (favouriteButtonLeft) {
        getFavouriteFighter(currentLeftFighterId, 1);
        favouriteButtonLeft.style.display = "block";
    }

    let fighterCardLeft = document.getElementById('fighter-card-left');
    let HTML = "";
    let headshotSrc = "";

    fighterCardLeft.style.display = "flex";

    if (leftdata.fighter_full_detail.athlete.headshot && leftdata.fighter_full_detail.athlete.headshot.href) {
        headshotSrc = leftdata.fighter_full_detail.athlete.headshot.href;
    } else {
        headshotSrc = leftdata.fighter_full_detail.athlete.gender === "FEMALE"
            ? "../MMA/img/silhouette-headshot-female.png"
            : "../MMA/img/no-profile-image.png";
    }

    FighterIDArrayLeft.forEach(upcomingFight => {
        HTML += `
            <div class="eventUpcoming">
                <p>${safe(upcomingFight.eventName)}</p>
                <p>Datum: ${safe(upcomingFight.date ? new Date(upcomingFight.date).toLocaleDateString('de-DE') : null)}</p>
                <p class="pWinOrLoss">(Upcoming)</p>
            </div>
        `;
    });

    Object.values(leftdata.fighter_full_detail.eventsMap).forEach(event => {
        HTML += `
            <div class="event">
                <p>${safe(event.name)}</p>
                <p>Länge: ${safe(event?.status?.displayClock)} Min, ${safe(event?.status?.period)} Runden</p>
                <p class="pWinOrLoss">(${safe(event.gameResult)})</p>
            </div>
        `;
    });

    fighterCardLeft.innerHTML = `
        <div class="stats-container">
            <p class="pStats">Statistiken</p>
            <div class="stats-info-container">
                <div class="left-stats-container">
                    <p>${safe(leftdata.fighter_full_detail.athlete.statsSummary.statistics[0].abbreviation)}</p>
                    <p>${safe(leftdata.fighter_full_detail.athlete.statsSummary.statistics[0].displayValue)}</p>
                </div>
                <div class="middle-stats-container">
                    <p>${safe(leftdata.fighter_full_detail.athlete.statsSummary.statistics[1].abbreviation)}</p>
                    <p>${safe(leftdata.fighter_full_detail.athlete.statsSummary.statistics[1].displayValue)}</p>
                </div>
                <div class="right-stats-container">
                    <p>${safe(leftdata.fighter_full_detail.athlete.statsSummary.statistics[2].abbreviation)}</p>
                    <p>${safe(leftdata.fighter_full_detail.athlete.statsSummary.statistics[2].displayValue)}</p>
                </div>
            </div>
        </div>
        <div class="fighter-info-header-container-left">
            <div class="info-main-container">
                <div class="info-container-left">
                    <img src="${headshotSrc}" alt="">
                    <div class="Name-Container">
                        <p class="pFirstName">${safe(leftdata.fighter_full_detail.athlete.firstName)}</p>
                        <p class="pLastName">${safe(leftdata.fighter_full_detail.athlete.lastName)}</p>
                        <div class="flag-division-info">
                            <img src="${safe(leftdata.fighter_full_detail.athlete.flag?.href)}" alt="">
                            <p class="pFlagName">${safe(leftdata.fighter_full_detail.athlete.flag?.alt)}</p>
                            <p class="pDivision">• ${safe(leftdata.fighter_full_detail.athlete.weightClass?.text)}</p>
                        </div>
                    </div>
                </div>
                <div class="info-container-middle">
                    <table class="fighter-table">
                        <tr>
                            <td><strong>Größe / Gewicht</strong></td>
                            <td>${safe(leftdata.fighter_full_detail.athlete.displayHeight)}, ${safe(leftdata.fighter_full_detail.athlete.displayWeight)}</td>
                        </tr>
                        <tr>
                            <td><strong>Geburtsdatum</strong></td>
                            <td>${safe(leftdata.fighter_full_detail.athlete.displayDOB)} (${safe(leftdata.fighter_full_detail.athlete.age)})</td>
                        </tr>
                        <tr>
                            <td><strong>Team</strong></td>
                            <td>${safe(leftdata.fighter_full_detail.athlete.association?.name)}</td>
                        </tr>
                        <tr>
                            <td><strong>Kampfstil</strong></td>
                            <td>${safe(leftdata.fighter_full_detail.athlete.displayFightingStyle)}</td>
                        </tr>
                        <tr>
                            <td class="tdLastChild"><strong>Kampfauslage</strong></td>
                            <td class="tdLastChild">${safe(leftdata.fighter_full_detail.athlete.stance?.text)}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="previous-events-container">
            ${HTML}
        </div>`;
}

function setStatsRight(rightdata) {
    let favouriteButtonRight = document.getElementById('favourite-btn-right');
    if (favouriteButtonRight) {
        getFavouriteFighter(currentRightFighterId, 2);
        favouriteButtonRight.style.display = "block";
    }

    let fighterCardRight = document.getElementById('fighter-card-right');
    let HTML = "";
    let headshotSrc = "";

    fighterCardRight.style.display = "flex";

    if (rightdata.fighter_full_detail.athlete.headshot && rightdata.fighter_full_detail.athlete.headshot.href) {
        headshotSrc = rightdata.fighter_full_detail.athlete.headshot.href;
    } else {
        headshotSrc = rightdata.fighter_full_detail.athlete.gender === "FEMALE"
            ? "../MMA/img/silhouette-headshot-female.png"
            : "../MMA/img/no-profile-image.png";
    }

    FighterIDArrayRight.forEach(upcomingFight => {
        HTML += `
            <div class="event">
                <p>${safe(upcomingFight.eventName)}</p>
                <p>Datum: ${safe(upcomingFight.date ? new Date(upcomingFight.date).toLocaleDateString('de-DE') : null)}</p>
                <p class="pWinOrLoss">(Upcoming)</p>
            </div>
        `;
    });

    Object.values(rightdata.fighter_full_detail.eventsMap).forEach(event => {
        HTML += `
            <div class="event">
                <p>${safe(event.name)}</p>
                <p>Länge: ${safe(event?.status?.displayClock)} Min, ${safe(event?.status?.period)} Runden</p>
                <p class="pWinOrLoss">(${safe(event.gameResult)})</p>
            </div>
        `;
    });

    fighterCardRight.innerHTML = `
        <div class="stats-container">
            <p class="pStats">Statistiken</p>
            <div class="stats-info-container">
                <div class="left-stats-container">
                    <p>${safe(rightdata.fighter_full_detail.athlete.statsSummary.statistics[0].abbreviation)}</p>
                    <p>${safe(rightdata.fighter_full_detail.athlete.statsSummary.statistics[0].displayValue)}</p>
                </div>
                <div class="middle-stats-container">
                    <p>${safe(rightdata.fighter_full_detail.athlete.statsSummary.statistics[1].abbreviation)}</p>
                    <p>${safe(rightdata.fighter_full_detail.athlete.statsSummary.statistics[1].displayValue)}</p>
                </div>
                <div class="right-stats-container">
                    <p>${safe(rightdata.fighter_full_detail.athlete.statsSummary.statistics[2].abbreviation)}</p>
                    <p>${safe(rightdata.fighter_full_detail.athlete.statsSummary.statistics[2].displayValue)}</p>
                </div>
            </div>
        </div>
        <div class="fighter-info-header-container-right">
            <div class="info-main-container">
                <div class="info-container-left">
                    <img src="${headshotSrc}" alt="">
                    <div class="Name-Container">
                        <p class="pFirstName">${safe(rightdata.fighter_full_detail.athlete.firstName)}</p>
                        <p class="pLastName">${safe(rightdata.fighter_full_detail.athlete.lastName)}</p>
                        <div class="flag-division-info">
                            <img src="${safe(rightdata.fighter_full_detail.athlete.flag?.href)}" alt="">
                            <p class="pFlagName">${safe(rightdata.fighter_full_detail.athlete.flag?.alt)}</p>
                            <p class="pDivision">${safe(rightdata.fighter_full_detail.athlete.weightClass?.text)} •</p>
                        </div>
                    </div>
                </div>
                <div class="info-container-middle">
                    <table class="fighter-table">
                        <tr>
                            <td><strong>Größe / Gewicht</strong></td>
                            <td>${safe(rightdata.fighter_full_detail.athlete.displayHeight)}, ${safe(rightdata.fighter_full_detail.athlete.displayWeight)}</td>
                        </tr>
                        <tr>
                            <td><strong>Geburtsdatum</strong></td>
                            <td>${safe(rightdata.fighter_full_detail.athlete.displayDOB)} (${safe(rightdata.fighter_full_detail.athlete.age)})</td>
                        </tr>
                        <tr>
                            <td><strong>Team</strong></td>
                            <td>${safe(rightdata.fighter_full_detail.athlete.association?.name)}</td>
                        </tr>
                        <tr>
                            <td><strong>Kampfstil</strong></td>
                            <td>${safe(rightdata.fighter_full_detail.athlete.displayFightingStyle)}</td>
                        </tr>
                        <tr>
                            <td class="tdLastChild"><strong>Kampfauslage</strong></td>
                            <td class="tdLastChild">${safe(rightdata.fighter_full_detail.athlete.stance?.text)}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="previous-events-container">
            ${HTML}
        </div>`;
}

async function setFavouriteFighter(side) {
    const fighterId = side === 'left' ? currentLeftFighterId : currentRightFighterId;
    const favouriteImg = document.getElementById(`favourite-img-${side}`);

    if (favouriteImg.getAttribute('src').includes("favourite_black.png")) {
        let formData = new FormData();
        formData.append('fighter_id', fighterId);
        await fetch(`${DB_API}?action=setFavouriteFighter`, { method: "POST", body: formData });
        favouriteImg.src = "../MMA/img/favourite_red.png";
    } else {
        let formData = new FormData();
        formData.append('fighter_id', fighterId);
        await fetch(`${DB_API}?action=deleteFavouriteFighter&fighterId=${fighterId}`, { method: "POST", body: formData });
        favouriteImg.src = "../MMA/img/favourite_black.png";
    }
}

async function getFavouriteFighter(fighter_id, currentStatsId) {
    const favouriteImg = document.getElementById(currentStatsId == 1 ? 'favourite-img-left' : 'favourite-img-right');

    return fetch(`${DB_API}?action=getFavouriteFighter&fighterId=${fighter_id}`)
        .then(res => res.json())
        .then(data => {
            favouriteImg.src = data
                ? "../MMA/img/favourite_red.png"
                : "../MMA/img/favourite_black.png";
        })
        .catch(error => console.error("Fehler:", error));
}

async function setFighterStats(id, name, side) {
    document.getElementById(`searchFighter-${side}`).value = name;
    document.getElementById(`${side}-search-container`).style.display = "none";
    showLoader(side);

    if (side === 'left') {
        currentLeftFighterId = id;
        await getScheduledFights("StatsLeft");
        let data = await loadStatsFromPlayerID(id);
        hideLoader(side);
        setStatsLeft(data);
    } else {
        currentRightFighterId = id;
        await getScheduledFights("StatsRight");
        let data = await loadStatsFromPlayerID(id);
        hideLoader(side);
        setStatsRight(data);
    }
}

async function getScheduledFights(SideStats) {
    const eventIDs = [];
    return fetch(`${MMA_API}?action=schedule`)
        .then(res => res.json())
        .then(data => {
            Object.values(data).forEach(events => {
                events.forEach(event => {
                    if (!event.completed)
                        eventIDs.push({ id: event.id });
                });
            });
            return getEventByID(eventIDs, SideStats);
        })
        .catch(error => console.error("Fehler:", error));
}

async function getEventByID(eventIDs, SideStats) {
    if (SideStats == "StatsLeft") {
        FighterIDArrayLeft = [];
    } else {
        FighterIDArrayRight = [];
    }

    const promises = eventIDs.map(element =>
        fetch(`${MMA_API}?action=scoreboardByID&eventID=${element.id}`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.competitions) return;

                Object.values(data.competitions).forEach(comp => {
                    if (SideStats == "StatsLeft") {
                        if (comp.competitors[0].id == currentLeftFighterId || comp.competitors[1].id == currentLeftFighterId) {
                            FighterIDArrayLeft.push({
                                eventName: data.name,
                                date: new Date(data.date).toLocaleDateString('de-DE'),
                            });
                        }
                    } else {
                        if (comp.competitors[0].id == currentRightFighterId || comp.competitors[1].id == currentRightFighterId) {
                            FighterIDArrayRight.push({
                                eventName: data.name,
                                date: new Date(data.date).toLocaleDateString('de-DE'),
                            });
                        }
                    }
                });
            })
            .catch(error => console.error("Fehler:", error))
    );

    await Promise.all(promises);
}

document.getElementById('searchFighter-left').addEventListener('input', function (event) {
    const searchString = event.target.value;
    document.getElementById('left-search-container').style.display = "block";

    if (searchString.length >= 2) {
        searchPlayer(searchString, 'left');
    } else {
        document.getElementById('left-search-container').innerHTML = "";
        document.getElementById('left-search-container').style.display = "none";
    }
});

document.getElementById('searchFighter-right').addEventListener('input', function (event) {
    const searchString = event.target.value;
    document.getElementById('right-search-container').style.display = "block";

    if (searchString.length >= 2) {
        searchPlayer(searchString, 'right');
    } else {
        document.getElementById('right-search-container').innerHTML = "";
        document.getElementById('right-search-container').style.display = "none";
    }
});

const selectedFighter = localStorage.getItem("selectedFighter");
if (selectedFighter) {
    localStorage.removeItem("selectedFighter");
    const fighter = JSON.parse(selectedFighter);
    setFighterStats(fighter.id, fighter.name, 'left');
}

function showLoader(side) {
    document.querySelector(`.lds-ring-${side}`).style.display = 'inline-block';
}

function hideLoader(side) {
    document.querySelector(`.lds-ring-${side}`).style.display = 'none';
}
