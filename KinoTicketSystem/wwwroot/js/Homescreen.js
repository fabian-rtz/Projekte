document.addEventListener("DOMContentLoaded", () => {initializePage();});

let countAttribute = 1;

async function initializePage() {
    let movies = await fetchMovies();

    if (movies && movies.length > 0) {
        let movieHTML = movies.map((movie) => {
         
            let showtimes = movie.shows && movie.shows.$values ? movie.shows.$values : [];
  
            return generateMovie(
                movie.id,
                movie.title,
                movie.image,
                movie.duration,
                movie.fsk,
                movie.genre,
                showtimes
            );
        }).join("");

        document.getElementById("movies-container").innerHTML = movieHTML;
    } else {
        document.getElementById("movies-container").innerHTML = "<p>Keine Filme verfügbar.</p>";
    }

    checkUserRole(); 
}

async function fetchMovies() {
    try {
        let response = await fetch("/api/movies", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error(`Fehler beim Abrufen der Filme: ${response.status} ${response.statusText}`);
            return [];
        }

        let data = await response.json();
        
        let movies = data.$values ? data.$values : data;
        console.log("movies: ",movies);
    
        return movies;
    } catch (error) {
        console.error("Netzwerkfehler:", error);
        return [];
    }
}

function checkUserRole() {
    let userDataString = localStorage.getItem('UserData');
    if (userDataString) {
        let userData = JSON.parse(userDataString);
        if (userData.role === "user") {
            let newMovieButton = document.getElementById('newMovieButton');   
                newMovieButton.style.display = "none";
        }
    } else {
        console.log("Keine Benutzerdaten gefunden.");
    }
}

function generateMovie(id, title, imageSrc, duration, fsk, genre, showtimesObj) {
   
    let showtimes = Array.isArray(showtimesObj) ? showtimesObj : (showtimesObj.values || []);

    let showtimesData = showtimes.map(show => ({
        date: new Date(show.date).toLocaleDateString("de-DE", {
            day: "numeric",
            month: "numeric",
            year: "numeric"
        }),
        hallId: show.hallId,
        time: show.time.substring(0, 5)
    }));

    return `
        <div class="film-info">
            <img class="img_movie" src="${imageSrc}" alt="${title}">
            <div class="info-container">
                <h1>${title}</h1>
                <div class="film-attribute">
                    <div class="img-con">
                        <img class="img-att" src="../img/clock.png" alt="Clock Icon">
                        <p class="att-inf">${duration} min</p>
                    </div>
                    <div class="img-con"> 
                        <img class="img-att" src="../img/info.png" alt="Info Icon">
                        <p class="att-inf">FSK ${fsk}</p>
                    </div>
                    <div class="img-con">
                        <img class="img-att" src="../img/tag.png" alt="Tag Icon">
                        <p class="att-inf">${genre}</p>
                    </div>
                </div>
                <div class="time-container">
                    ${showtimes.length > 0 ? showtimes.map(show => `
                        <div class="time-inf">
                            <p>${new Date(show.date).toLocaleDateString("de-DE", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric"
                            })}</p>
                            <p>Saal ${show.hallId}</p>
                           <button onclick="redirectToHall('${new Date(show.date).toLocaleDateString("de-DE", {day: 'numeric', month: 'numeric', year: 'numeric'})}','${show.time.substring(0,5)}',${id},'${title}', ${show.hallId},${show.id})">${show.time.substring(0,5)}</button>
                        </div>
                    `).join("") : "<p>Keine Spielzeiten verfügbar</p>"}
                </div>
            </div>         
            <button 
                class="changeMovie"
                onclick="DisplayFormUpdate(this)" 
                data-id="${id}"
                data-imgsrc="${imageSrc}"
                data-title="${title}"
                data-duration="${duration}"
                data-fsk="${fsk}"
                data-genre="${genre}"
                data-showtimes='${JSON.stringify(showtimesData)}' 
            >+</button>  
        </div>
    `;
}

function redirectToHall(date,time,id,title, hallId, showId) {
    localStorage.setItem("selectedDate",date);
    localStorage.setItem("selectedTime",time);
    localStorage.setItem("selectedMovieID", id);
    localStorage.setItem("selectedMovie", title);
    localStorage.setItem("selectedHallID", hallId);
    localStorage.setItem("selectedShowID",showId)
    
    window.location.href = "Loadingbar.html"; 
}
function DisplayFormCreate() {
    let createFilm = document.getElementById("createFilm");
    createFilm.style.display = createFilm.style.display === "none" || createFilm.style.display === "" 
        ? "block" 
        : "none";
}

let movieIDForDatabaseChange;

function DisplayFormUpdate(button) {
    document.getElementById("SubmitInfo").innerHTML = `Speichern`;
    document.getElementById("SubmitInfo").setAttribute("onclick", "submitMovie(2)");

    movieIDForDatabaseChange = button.getAttribute("data-id");

    console.log(movieIDForDatabaseChange);

    let createFilm = document.getElementById("createFilm");
    createFilm.style.display = createFilm.style.display === "none" || createFilm.style.display === "" 
        ? "block" 
        : "none";

    document.getElementById('createImgBtn').innerHTML = `
        <img src="${button.getAttribute("data-imgsrc")}">
    `;

    document.getElementById("inputTitle").value = button.getAttribute("data-title");
    document.getElementById("attributeLength").value = button.getAttribute("data-duration");
    document.getElementById("attributeFsk").value = button.getAttribute("data-fsk");
    document.getElementById("attributeGenre").value = button.getAttribute("data-genre");

    let hallInfoContainer = document.getElementById("hallInfoContainer");
    hallInfoContainer.innerHTML = "";

    let showtimes = JSON.parse(button.getAttribute("data-showtimes"));

    countAttribute = 0; // Zähler zurücksetzen

    // 🟢 `addHallInfo()` für jede Show aufrufen
    for (let i = 0; i < showtimes.length; i++) {
        addHallInfo(); // Erstellt eine neue `hall-row`
        let index = i + 1; // Die richtige ID setzen

        document.getElementById(`attributeDate-${index}`).value = formatDate(showtimes[i].date);
        document.getElementById(`attributeHall-${index}`).value = showtimes[i].hallId;
        document.getElementById(`attributeTime-${index}`).value = showtimes[i].time;
    }

    // ✅ `+`-Button nur einfügen, wenn weniger als 3 `hall-row`s existieren
    if (showtimes.length < 3) {
        hallInfoContainer.innerHTML += `
            <button id="addHallInfoBtn" onclick="addHallInfo()">+</button>
        `;
    }
}


function parseMovieShowtimesToHTML(movieShowtimes){
    movieShowtimes.forEach((show, index) => {
        let newHallRowHTML = `
            <div class="hall-row">
                <input type="date" id="attributeDate-${index + 1}" class="attribute-hall" value="${formatDate(show.date)}">
                <select id="attributeHall-${index + 1}" class="attribute-hall-DropDown">
                    <option value="1" ${show.hallId == 1 ? "selected" : ""}>Saal 1</option>
                    <option value="2" ${show.hallId == 2 ? "selected" : ""}>Saal 2</option>
                </select>
                <input type="time" id="attributeTime-${index + 1}" class="attribute-hall-time" value="${show.time}">
            </div>
        `;
        hallInfoContainer.innerHTML += newHallRowHTML;
    });


    if (movieShowtimes.length === 0) {
        hallInfoContainer.innerHTML = `
            <div class="hall-row">
                <input type="date" id="attributeDate-1" class="attribute-hall" placeholder="Datum">
                <select id="attributeHall-1" class="attribute-hall-DropDown">
                    <option value="" disabled selected>Wähle einen Saal</option>
                    <option value="1">Saal 1</option>
                    <option value="2">Saal 2</option>
                </select>
                <input type="time" id="attributeTime-1" class="attribute-hall-time" placeholder="Uhrzeit">
            </div>
        `;
    }
}

function formatDate(inputDate) {
    let parts = inputDate.split(".");
    let day = String(parts[0]).padStart(2, "0");  
    let month = String(parts[1]).padStart(2, "0"); 
    let year = parts[2];

    return `${year}-${month}-${day}`;
}

function createImg() {
    let imageInputHTML = `
        <input type="file" id="imageInput" style="display:none;" accept="image/*">
    `;
    document.body.insertAdjacentHTML("beforeend", imageInputHTML);

    let imageInput = document.getElementById("imageInput");
    imageInput.addEventListener("change", (event) => {
        handleImageUpload(event);
        imageInput.remove(); 
    });

    imageInput.click();
}

function handleImageUpload(event) {
    let file = event.target.files[0];
    if (file) {
       
        let fileName = file.name;    
        let imagePath = `../img/${fileName}`;
     
        let createImgBtn = document.getElementById("createImgBtn");
        createImgBtn.innerHTML = `
            <img src="${imagePath}" alt="${fileName}">
        `;

    }
}

function addHallInfo() {
    countAttribute++; // Zähler hochzählen

    let hallInfoContainer = document.getElementById("hallInfoContainer");
    let addHallInfoBtn = document.getElementById("addHallInfoBtn");

    let newHallRowHTML = `
        <div class="hall-row">
            <input type="date" id="attributeDate-${countAttribute}" class="attribute-hall" placeholder="Datum">
            <select id="attributeHall-${countAttribute}" class="attribute-hall-DropDown">
                <option value="" disabled selected>Wähle einen Saal</option>
                <option value="1">Saal 1</option>
                <option value="2">Saal 2</option>
            </select>
            <input type="time" id="attributeTime-${countAttribute}" class="attribute-hall-time" placeholder="Uhrzeit">
        </div>
    `;

    // Neue Hall-Reihe direkt vor dem `+`-Button einfügen
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = newHallRowHTML;
    let newHallRow = tempDiv.firstElementChild;

    hallInfoContainer.insertBefore(newHallRow, addHallInfoBtn);

    // ✅ `+`-Button verstecken, wenn `countAttribute` >= 3
    if (countAttribute >= 3) {
        addHallInfoBtn.style.display = "none";
    }
}




async function submitMovie(index) {
    let movieData = collectAndValidateMovieData();
    if (!movieData) return;

    console.log("Sende folgenden Film mit Shows an API:", JSON.stringify(movieData, null, 2));

    try {
         if(index == 1){
            let savedMovie = await saveMovieToServer(movieData);
            handleSaveSuccess(savedMovie);
            location.reload();
         }
         else{
            let savedMovie = await saveChangedMovieToServer(movieData);
            handleSaveSuccess(savedMovie);
            location.reload();
         }
      
       
    } catch (error) {
        handleSaveError(error);
    }
}

function collectAndValidateMovieData() {
    let movieData = collectMovieData();

    if (!movieData) {
        alert("Bitte fülle alle erforderlichen Felder aus.");
        return null;
    }

    let showtimes = collectShowtimes();
    if (showtimes.length === 0) {
        alert("Bitte mindestens eine Show eingeben.");
        return null;
    }

    return {
        title: movieData.title,
        image: movieData.imageSrc,
        duration: parseInt(movieData.duration),
        fsk: movieData.fsk,
        genre: movieData.genre,
        shows: showtimes.map(show => ({
            date: show.date,
            hallId: parseInt(show.hallId),
            time: show.time
        }))
    };
}

async function saveMovieToServer(movieData) {
    console.log("Sende an API:", JSON.stringify(movieData, null, 2)); // Debugging

    let response = await fetch("/api/movies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData), 
    });

    if (!response.ok) {
        let errorText = await response.text();
        console.error(`Fehler beim Speichern des Films: ${response.status} ${response.statusText}`);
        console.error("Antwortinhalt:", errorText);
        throw new Error("Fehler beim Speichern des Films");
    }
    
    location.reload();
    return await response.json();
   
}

async function saveChangedMovieToServer(movieData){
    console.log("Sende an API:", JSON.stringify(movieData, null, 2)); // Debugging

    let response = await fetch(`/api/movies/${movieIDForDatabaseChange}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(movieData), 
    });

    if (!response.ok) {
        let errorText = await response.text();
        console.error(`Fehler beim Speichern des Films: ${response.status} ${response.statusText}`);
        console.error("Antwortinhalt:", errorText);
        throw new Error("Fehler beim Speichern des Films");
    }
    
    location.reload();
    return await response.json();
}

function handleSaveSuccess(savedMovie) {
    console.log("Film erfolgreich gespeichert:", savedMovie);

    let movieHTML = generateMovie(
        savedMovie.title,
        savedMovie.image,
        savedMovie.duration,
        savedMovie.fsk,
        savedMovie.genre,
        savedMovie.shows || []  
    );

    addMovieToContainer(movieHTML);
    resetForm();
}


function handleSaveError(error) {
    console.error("Netzwerkfehler beim Speichern des Films:", error);
    alert("Netzwerkfehler. Bitte überprüfe deine Verbindung.");
}



function collectMovieData() {
    let title = document.getElementById("inputTitle").value.trim();
    let duration = document.getElementById("attributeLength").value.trim();
    let fsk = document.getElementById("attributeFsk").value.trim();
    let genre = document.getElementById("attributeGenre").value.trim();

    if (!title || !duration || !fsk || !genre) {
        return null;
    }

    let createImgBtn = document.getElementById("createImgBtn");
    let imgElement = createImgBtn.querySelector("img");
    let imageSrc = imgElement ? imgElement.src : "../img/default-movie.jpg";

    return { title, duration, fsk, genre, imageSrc };
}

function collectShowtimes() {
    let showtimes = [];

    document.querySelectorAll(".hall-row").forEach((row, index) => {
        let date = row.querySelector(".attribute-hall")?.value?.trim();
        let hall = row.querySelector(".attribute-hall-DropDown")?.value?.trim();
        let time = row.querySelector(".attribute-hall-time")?.value?.trim();

        console.log(`Show ${index + 1}:`, { date, hall, time });

       
        if (hall && isNaN(hall)) {
            hall = hall.replace(/\D/g, "");  
        }

        let parsedHallId = parseInt(hall, 10); 
        if (isNaN(parsedHallId)) {
            console.error(`FEHLER: Ungültige HallId! Erhalten: "${hall}"`);
            return;
        } else {
            console.log(`HallId erfolgreich gespeichert: ${parsedHallId}`);
        }

        
        if (!time) {
            console.error(`FEHLER: Ungültige Zeit für Show ${index + 1}`);
            return;
        }

        let parsedTime = time.includes(":") ? time + ":00" : time + ":00:00";

        if (date && parsedTime) {
            showtimes.push({
                date: date,
                hallId: parsedHallId,
                time: parsedTime 
            });
        } else {
            console.warn(`Ungültige Show-Daten! Date: "${date}", Hall: "${hall}", Time: "${parsedTime}"`);
        }
    });

    console.log("Gesammelte Shows:", showtimes);
    return showtimes;
}

function addMovieToContainer(movieHTML) {
    let moviesContainer = document.getElementById("movies-container");
    moviesContainer.innerHTML += movieHTML;
}

// #region My region

// #endregion
function resetForm() {
    document.getElementById("inputTitle").value = "";
    document.getElementById("attributeLength").value = "";
    document.getElementById("attributeFsk").value = "";
    document.getElementById("attributeGenre").value = "";
    document.getElementById("createImgBtn").innerHTML = "+";

    let hallRows = document.querySelectorAll(".hall-row");
    hallRows.forEach((row, index) => {
        if (index > 0) row.remove();
    });

    document.getElementById("attributeDate").value = "";
    document.getElementById("attributeHall").value = "";
    document.getElementById("attributeTime").value = "";
    countAttribute = 1;

    document.getElementById("createFilm").style.display = "none";
}
