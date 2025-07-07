document.addEventListener("DOMContentLoaded", function() {

    async function register() {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        let registerData = {
            username: username,
            password: password
        };

        console.log("Registrierungsdaten:", registerData);

        try {
            let response = await fetch('https://localhost:7093/api/Auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            if (response.ok) {
                let result = await response.json();
                console.log("Erfolgreiche Registrierung:", result);
                document.getElementById('responseMessage').textContent = result.message;
            } else {
                let errorText = await response.json();
                console.error("Fehler bei der Registrierung:", errorText);
                document.getElementById('responseMessage').textContent = errorText.message || 'Fehler bei der Registrierung.';
            }
        } catch (error) {
            console.error('Fehler bei der Registrierung:', error);
            document.getElementById('responseMessage').textContent = 'Fehler bei der Registrierung.';
        }
    }

    async function login() {
        console.log("Login-Prozess gestartet");
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
    
        let loginData = {
            username: username,
            password: password
        };
    
        console.log("Login-Daten:", loginData);
    
        try {
            let response = await fetch('https://localhost:7093/api/Auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });
    
            if (response.ok) {
                let result = await response.json();
                console.log("Erfolgreicher Login:", result);
    
                // Benutzerdaten im localStorage speichern
                if (result.userData) {
                    localStorage.setItem('UserData', JSON.stringify(result.userData));
                    console.log("Benutzerdaten gespeichert:", result.userData);
                }
    
                // Erfolgsnachricht anzeigen
                document.getElementById('responseMessage').textContent = "Login erfolgreich";
    
                // Weiterleitung zur angegebenen URL
                window.location.href = result.redirectUrl;
            } else {
                // Fehlernachricht vom Server anzeigen
                let errorText = await response.json();
                console.error("Fehler beim Login:", errorText);
                document.getElementById('responseMessage').textContent = errorText.message || 'Login fehlgeschlagen.';
            }
        } catch (error) {
            // Allgemeine Fehlerbehandlung
            console.error('Fehler beim Login:', error);
            document.getElementById('responseMessage').textContent = 'Fehler beim Login. Überprüfen Sie die Konsole.';
        }
    }
    

    // Event-Listener für das Formular
    document.getElementById('mainForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Verhindert das Standard-Formular-Submit

        // Bestimmen, welcher Button geklickt wurde
        let action = e.submitter ? e.submitter.id : null; // `submitter` gibt das geklickte Button-Element zurück

        if (action === 'register-btn') {
            register(); 
        } else if (action === 'login-btn') {
            login(); 
        } else {
            console.warn("Unbekannte Aktion:", action);
        }
    });
});
