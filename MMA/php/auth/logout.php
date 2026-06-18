<?php
    session_start();

    include "../database/db.php";
        
    $log = $conn->prepare("INSERT INTO Logging (Beschreibung, Benutzer_ID) VALUES (?, ?)");
    $beschreibung = "Benutzer hat sich ausgeloggt";
    $log->bind_param("si", $beschreibung, $_SESSION['user_id']);
    $log->execute();
    $log->close();

    session_unset();
    session_destroy();
    
    header("Location: login.php");
    exit;
?>