let homeLink = document.getElementById('home-link');
let trashLink = document.getElementById('trash-link');
let homeSection = document.getElementById('home');
let trashSection = document.getElementById('trash');
let noteInput = document.getElementById('note-input');
let noteCounter = 1;

let notes = [];
let trashNotes = [];

function addNote() {
    let noteTitle = noteInput.value.trim() || `Überschrift ${noteCounter}`;
    noteInput.value = '';

    notes.push({
        title: noteTitle,
        description: ""
    });
    
    localStorage.setItem('notes', JSON.stringify(notes));
    
    renderNotes();
    noteCounter++;
}


function deleteNote(id){
    trashNotes.push(note);
    notes.splice(id,1);
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('trashNotes', JSON.stringify(trashNotes));
    renderNotes();
    renderTrash();
}

function deleteTrashNote(id){
    trashNotes.splice(id,1);
    localStorage.setItem('trashNotes', JSON.stringify(trashNotes));
    renderTrash();
}


function restoreNote(noteId) {
    notes.push({
        title: trashNotes[noteId].title,
        description: trashNotes[noteId].description
    });

    deleteTrashNote(noteId);

    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('trashNotes', JSON.stringify(trashNotes));
    renderNotes();
    renderTrash();
}

function editNote(noteId) {
    let note = notes[noteId];
    let noteElement = document.getElementById(`note${noteId}`);

    noteElement.innerHTML = `
        <div class="TextArea">
            <div class="ÜberschriftNote">
                <input type="text" class="note-title-input" id="edit-title-${noteId}" value="${note.title}">
            </div>
            <div class="BeschreibungNote">
                <textarea class="note-description-input" id="edit-description-${noteId}">${note.description}</textarea>
            </div>
        </div>
        <div class="FunctionBtn">
            <button onclick="saveChanges(${noteId})">S</button>
        </div>`;
}


function saveChanges(noteId) {
    
    let newTitle = document.getElementById(`edit-title-${noteId}`).value.trim();
    let newDescription = document.getElementById(`edit-description-${noteId}`).value.trim();
    
    notes[noteId] = { title: newTitle, description: newDescription };
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    let tempNotes = localStorage.getItem('notes');
    if (tempNotes) {
        notes = JSON.parse(tempNotes);
    }
    let noteContainer = document.getElementById('notes-container');
    noteContainer.innerHTML = '';

    for (let i = 0; i < notes.length; i++) {
        noteContainer.innerHTML += generateNoteHTML(notes[i], i);
    }
}

function renderTrash() {
    let tempTrash = localStorage.getItem('trashNotes');
    if (tempTrash) {
        trashNotes = JSON.parse(tempTrash);
    }
    let trashContainer = document.getElementById('trash-container');
    trashContainer.innerHTML = '';

    for (let i = 0; i < trashNotes.length; i++) {
        trashContainer.innerHTML += generateTrashNoteHTML(trashNotes[i], i);
    }
}

function generateNoteHTML(element, i) {
    return `
        <div class="note" id="note${i}">
            <div class="TextArea">
                <div class="ÜberschriftNote" id="title-note${i}">
                    <h3>${element.title}</h3>
                </div>
                <div class="BeschreibungNote" id="description-note${i}">
                    <p>${element.description}</p>
                </div>
            </div>
            <div class="FunctionBtn">
                <button onclick="editNote(${i})">B</button>
                <button onclick="saveChanges(${i})" disabled>S</button>
                <button onclick="deleteNote(${i})">D</button>
            </div>
        </div>`;
}

function generateTrashNoteHTML(element, i) {
    return `
        <div class="note" id="trash-note${i}">
            <div class="TextArea">
                <div class="ÜberschriftNote">
                    <h3>${element.title}</h3>
                </div>
                <div class="BeschreibungNote">
                    <p>${element.description}</p>
                </div>
            </div>
            <div class="FunctionBtn">
                <button onclick="restoreNote(${i})">W</button>
                <button onclick="deleteTrashNote(${i})">EL</button>
            </div>
        </div>`;
}

function toggleActiveSection(section) {
    if (section == 'home') {
        homeLink.classList.add('active');
        trashLink.classList.remove('active');
        homeSection.style.display = 'block';
        trashSection.style.display = 'none';
    } else if (section == 'trash') {
        trashLink.classList.add('active');
        homeLink.classList.remove('active');
        trashSection.style.display = 'block';
        homeSection.style.display = 'none';
        renderTrash();
    }
}

