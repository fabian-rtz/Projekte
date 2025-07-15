function openCreateNote() {
    const popupContainer = document.getElementById('popupContainer');
    const textarea = document.getElementById('taCreateNote');
    const createButton = document.querySelector('.CreateNoteButton button:first-child');
    const closeButton = document.querySelector('.CreateNoteButton button:last-child');

    // Setzen Sie den Wert des Textbereichs auf leer
    textarea.value = '';

    // Setzen Sie den Text und die Funktion des Buttons auf "Erstellen"
    createButton.textContent = 'Erstellen';
    createButton.onclick = function() {
        createNote(); // Funktion zum Erstellen einer neuen Notiz aufrufen
    };

    closeButton.onclick = function() {
        closeCreateNote('1');
    };

    // Zeigen Sie das Popup an
    popupContainer.style.display = 'block';
}
function closeCreateNote(CheckValue){

if(CheckValue == "1"){
   
    if(document.getElementById('taCreateNote').value.length == 0){       
        document.getElementById('taCreateNote').value = "";
        document.querySelector('#popupContainer').style.display = 'none';
    }
    else{
      var confirmation = confirm("Wollen Sie die Notiz wirklich schließen\n");

      if(confirmation){
        document.getElementById('taCreateNote').value = "";
        document.querySelector('#popupContainer').style.display = 'none';
      }
    }
}
else{
    document.getElementById('taCreateNote').value = "";
    document.querySelector('#popupContainer').style.display = 'none';
    }
 
   
}
function createNote(){
    const popupContainer = document.getElementById('#popupContainer');
    const noteText = document.getElementById('taCreateNote').value;
    if(noteText.trim !==''){
        const note = {
            id: new Date().getTime(),
            text: noteText
        };

        const existingNotes = JSON.parse(localStorage.getItem('notes')) || []
        existingNotes.push(note);

        localStorage.setItem('notes',JSON.stringify(existingNotes));

        document.getElementById('taCreateNote').value = '';

        closeCreateNote('2');
        displayNotes();
    }
   
}
function displayNotes() {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = '';

    const notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes.forEach(note => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
        <span>${note.text}</span>
        <div id="noteBtns-container">
            <button id="editBtn" onclick="editNote(${note.id})"><i>edit</i></button>
            <button id="deleteBtn" onclick="deleteNote(${note.id})"><i>delete</i></button>
        </div>
        `;
        notesList.appendChild(listItem);
    });
}

function editNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => note.id == noteId);
    const noteText = noteToEdit ? noteToEdit.text : '';

    const popupContainer = document.getElementById('popupContainer');
    const textarea = document.getElementById('taCreateNote');
    const createButton = document.querySelector('.CreateNoteButton button:first-child');
    const closeButton = document.querySelector('.CreateNoteButton button:last-child');

    // Setzen Sie den Wert des Textbereichs auf den Text der Notiz
    textarea.value = noteText;

    // Fügen Sie das Attribut 'data-note-id' zum Container hinzu, um die ID der bearbeiteten Notiz zu speichern
    popupContainer.setAttribute('data-note-id', noteId);

    // Ändern der onclick-Funktionen
    createButton.textContent = 'Aktualisieren'; // Ändern Sie den Text des Buttons
    createButton.onclick = function() {
        updateNote(); // Ändern Sie die Funktion des Buttons
    };

    closeButton.onclick = function() {
        closeCreateNote('1');
    };

    // Zeigen Sie das Popup an
    popupContainer.style.display = 'block';
}

function updateNote() {
    const noteText = document.getElementById('taCreateNote').value.trim();
    const editingPopup = document.getElementById('popupContainer'); // Hier popupContainer verwenden

    if (noteText !== '') {
        const noteId = editingPopup.getAttribute('data-note-id');
        let notes = JSON.parse(localStorage.getItem('notes')) || [];

        // Find the note to update
        const updatedNotes = notes.map(note => {
            if (note.id == noteId) {
                return { id: note.id, text: noteText };
            }
            return note;
        });

        // Update the notes in local storage
        localStorage.setItem('notes', JSON.stringify(updatedNotes));

        // Close the editing popup
        editingPopup.style.display = 'none';

        // Refresh the displayed notes
        displayNotes();
    }
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes = notes.filter(note => note.id !== noteId);

    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes();
}

displayNotes();
