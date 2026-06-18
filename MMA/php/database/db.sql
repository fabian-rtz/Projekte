CREATE DATABASE IF NOT EXISTS MMA;
USE MMA;

CREATE TABLE IF NOT EXISTS Benutzer (
    Benutzer_ID   INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Benutzername  VARCHAR(100) NOT NULL UNIQUE,
    Passwort      VARCHAR(255) NOT NULL,
    Vorname       VARCHAR(100) NOT NULL,
    Nachname      VARCHAR(100) NOT NULL,
    Email         VARCHAR(100) NOT NULL,
    Geburtsdatum  DATE         NOT NULL
);

CREATE TABLE IF NOT EXISTS Chat (
    Chat_ID       INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Chat          VARCHAR(255) NOT NULL,
    Benutzer_ID   INT          NOT NULL,
    Date          TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (Benutzer_ID) REFERENCES Benutzer(Benutzer_ID)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS Favoriten (
    Favoriten_ID  INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Benutzer_ID   INT NOT NULL,
    Fighter_ID    INT NOT NULL,

    FOREIGN KEY (Benutzer_ID) REFERENCES Benutzer(Benutzer_ID)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS Logging (
    Logging_ID    INT          NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Beschreibung  VARCHAR(255) NOT NULL,
    Benutzer_ID   INT          NOT NULL,

    FOREIGN KEY (Benutzer_ID) REFERENCES Benutzer(Benutzer_ID)
        ON DELETE CASCADE
        ON UPDATE RESTRICT
);