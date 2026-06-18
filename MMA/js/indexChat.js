function loadChatfromDB(){
    fetch(`${DB_API}?action=getChat`)
        .then(res => res.json())
        .then(data => loadChat(data));
}

async function loadChat(data){
    let chatContainer = document.getElementById('chat-container');
    let HTML = "";
    data.forEach(element => {
        console.log(element);
        HTML += `
            <div class="message-container-inner">
                <p class="pDate">${new Date(element.Date).toLocaleString("de-DE")}</p>
                <p class="pChat">${element.Chat}</p>
                <p class="pUsername">${element.Benutzername}</p>
            </div>
        `;
    });

    chatContainer.innerHTML = `
        <div id="message-container-outer">
            ${HTML}
        </div>
        <div id="send-message-container">
            ${formHTML}
        </div>
    `;

    const form = document.getElementById('chat-form');
    if(form){
        form.addEventListener('submit', sendMessage);
    }

    const outerContainer = document.getElementById('message-container-outer');
    if(outerContainer){
        outerContainer.scrollTop = outerContainer.scrollHeight;
    }
}

async function sendMessage(event){
    event.preventDefault();

    let message = document.getElementById('message-input');
    if(message.value.trim() === ''){ 
       alert('Bitte eine Nachricht eingeben!') 
       return;
    }

    let formData = new FormData();
    formData.append('message', message.value);

    await fetch(`${DB_API}?action=setChat`, {
        method: "POST",
        body: formData
    });

    message.value = '';
    loadChatfromDB();
}

loadChatfromDB();
setInterval(loadChatfromDB, 5 * 60 * 1000);
