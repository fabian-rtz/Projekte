let alleFragen = [];
let aktuellerIndex = 0;
let fallGelesen = false;
let gesammelteAntworten = {}; 
let infoOhneFallGelesen = false;

function loadQuestionsfromDB(){
    fetch(`${DB_API}?action=getQuestions`)
        .then(res => res.json())
        .then(data => loadQuestions(data));
}

function loadQuestions(data){
    alleFragen = data;
    aktuellerIndex = 0;
    fallGelesen = false;
    infoOhneFallGelesen = false;
    gesammelteAntworten = {}; 
    zeigeDefinition();
    
}

function zeigeDefinition(){
    let questionContainerOuter = document.getElementById('question-container-outer'); 

    questionContainerOuter.innerHTML = `
            <div class="question-container">     
                <p>Künstliche Intelligenz bezeichnet in unserem Kontext 
                plattformübergreifende Algorithmen, die basierend auf Nutzbedürfnissen 
                personalisierte Inhalte wiedergeben.</p>
                
                <p>Im folgenden Fragebogen fokussieren wir uns auf Güter mit niedrigem Warenwert (<50 EUR) 
                und den Einkauf im Online-Handel.</p>
                
                <button id="weiter-btn" onclick="zeigeInformation()">weiter</button>
            </div>`;
}

function zeigeInformation(){
    let questionContainerOuter = document.getElementById('question-container-outer'); 

    questionContainerOuter.innerHTML = `
            <div class="question-container">     
                <p>Im Folgenden werden Ihnen verschiedene Situationen gegeben. 
                Zu jeder Situation finden Sie mehrere Aussagen. 
                Bitte lesen Sie die Situationen aufmerksam durch und bewerten Sie anschließend 
                die Aussagen entsprechend Ihrer persönlichen Einschätzung oder Erfahrung.</p>
                
                <button id="weiter-btn" onclick="zeigeAktuelleFrage()">weiter</button>
            </div>`;
}

function zeigeFrageOhneFallInformation(){
    let questionContainerOuter = document.getElementById('question-container-outer'); 

    questionContainerOuter.innerHTML = `
            <div class="question-container">     
                <p>Im Folgenden werden Ihnen einzelne Aussagen gegeben. 
                Diese stehen in keinem direkten Zusammenhang miteinander. 
                Bitte beantworten Sie jede Frage unabhängig voneinander anhand 
                Ihrer persönlichen Einschätzung und Erfahrung.</p>

                <button id="weiter-btn" onclick="bestaetigeInfoOhneFall()">weiter</button>
            </div>`;
}

// Neue Hilfsfunktion hinzufügen:
function bestaetigeInfoOhneFall() {
    infoOhneFallGelesen = true; 
    zeigeAktuelleFrage(); 
}


function zeigeAktuelleFrage(){
    let questionContainerOuter = document.getElementById('question-container-outer');


    // Ende der Umfrage: Demografie-Formular
    if (aktuellerIndex >= alleFragen.length) {
       questionContainerOuter.innerHTML = `
        <div class="question-container">     
            <p>Fast geschafft! Bitte fülle noch diese Daten aus:<p>
            <label for="alter">Alter:</label>
            <input type="number" id="alter" name="alter" min="1" max="120" required>
            <br></br>
            <label for="geschlecht">Geschlecht:</label>
            <select id="geschlecht" name="geschlecht">
                <option value="" disabled selected>Bitte auswählen...</option>
                <option value="maennlich">Männlich</option>
                <option value="weiblich">Weiblich</option>
                <option value="divers">Divers</option>
                <option value="keine_angabe">Keine Angabe</option>
            </select>
            <br></br>
            <label for="beschaeftigungsstatus">Beschäftigungsstatus:</label>
            <select id="beschaeftigungsstatus" name="beschaeftigungsstatus">
                <option value="" disabled selected>Bitte auswählen...</option>
                <option value="Schüler">Schüler</option>
                <option value="Student">Student</option>
                <option value="Erwerbstätig">Erwerbstätig</option>
                <option value="Sonstige (Renter, Arbeitslos, etc.)">Sonstige (Renter, Arbeitslos, etc.)</option>
            </select>
            <br></br>
            <button id="weiter-btn" onclick="umfrageAbsenden()">Umfrage abschließen & Senden</button>
        </div>`;
        return;
    }

    let Fall = alleFragen[aktuellerIndex].fall;

    // Fall-Text anzeigen, falls vorhanden und noch nicht gelesen
    if (Fall != null && Fall !== "" && !fallGelesen) {
        questionContainerOuter.innerHTML = `
            <div class="question-container">     
               <p>${Fall}</p>
               <button id="weiter-btn" onclick="bestaetigeFall()">Weiter</button>
            </div>`;
        return; 
    }

    // NEU: Info anzeigen, wenn es KEINEN Fall gibt und die Info noch nicht gelesen wurde
    if ((Fall == null || Fall === "") && !infoOhneFallGelesen) {
        zeigeFrageOhneFallInformation();
        return; // SEHR WICHTIG: Hier muss return stehen, damit er nicht direkt die Frage anzeigt!
    }

    // Frage mit 7er Skala anzeigen
    questionContainerOuter.innerHTML = ` 
        <h2>${Fall || ""}</h2>
        <div class="question-container">     
            <p>${alleFragen[aktuellerIndex].fragen}</p>
            <div class="radio-group-container">
                <div class="radio-group">
                    <label>
                        <input type="radio" name="bewertung" value="1">
                        <span>Stimme überhaupt nicht zu</span>
                    </label>
                    <label>
                        <input type="radio" name="bewertung" value="2">
                        <span>Stimme nicht zu </span>
                    </label>
                    <label>
                        <input type="radio" name="bewertung" value="3">
                        <span>Stimme weder zu noch lehne ich ab</span>
                    </label>
                    <label>
                        <input type="radio" name="bewertung" value="4">
                        <span>Stimme zu</span>
                    </label>
                    <label>
                        <input type="radio" name="bewertung" value="5">
                        <span>Stimme voll und ganz zu</span>
                    </label>
                </div>
                <button id="weiter-btn" onclick="naechsteFrage()">Weiter</button>
            </div>
        </div>
        `;
}

function bestaetigeFall() {
    fallGelesen = true; 
    zeigeAktuelleFrage(); 
}

function naechsteFrage() {
    let ausgewaehlterRadio = document.querySelector('input[name="bewertung"]:checked');
    if (!ausgewaehlterRadio) {
        alert("Bitte wähle eine Antwort aus!");
        return; 
    }

    let frageId = alleFragen[aktuellerIndex].ID;
    gesammelteAntworten[frageId] = ausgewaehlterRadio.value;

    let bisherigerFall = alleFragen[aktuellerIndex].fall;
    aktuellerIndex++; 

    if (aktuellerIndex < alleFragen.length) {
        if (bisherigerFall !== alleFragen[aktuellerIndex].fall) {
            fallGelesen = false; 
        }
    }
    zeigeAktuelleFrage(); 
}

function umfrageAbsenden() {
    const alterWert = document.getElementById('alter').value;
    const geschlechtWert = document.getElementById('geschlecht').value;
    const beschaeftigungsstatus = document.getElementById('beschaeftigungsstatus').value;

    if (!alterWert) {
        alert("Bitte gib dein Alter an.");
        return;
    }

    const payload = {
        demografie: {
            alter: parseInt(alterWert), 
            geschlecht: geschlechtWert,
            beschaeftigungsstatus: beschaeftigungsstatus
        },
        antworten: gesammelteAntworten 
    };

    fetch(`${DB_API}?action=saveAnswers`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
    })
    .then(res => res.json())
.then(data => {
        if(data.success) {
            document.cookie = "abgeschlossen=ja; max-age=" + (60 * 60 * 24 * 30) + "; path=/";
            window.location.href = "index.php";

        } else {
            alert("Fehler: " + data.error);
        }
    })
    .catch(err => console.error("Sende-Fehler:", err));
}

loadQuestionsfromDB();
