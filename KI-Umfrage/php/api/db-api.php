<?php
$trusteddomain = "http://localhost:4000";
header("Access-Control-Allow-Origin: $trusteddomain");
header("Content-Type: application/json");

session_start();

require_once __DIR__ . '/../db/db.php';

// Prüfung der Verbindung
if(!$conn){
    echo json_encode(["success" => false, "error" => "Verbindung zur Datenbank fehlgeschlagen"]);
    exit;
}

/**
 * Lädt alle Fragen und die zugehörigen Fall-Texte
 */
function getQuestions($conn){
    $sql = "SELECT Fragen.ID, Fragen.fragen, Fall.fall 
            FROM Fragen
            LEFT JOIN Fall ON Fall.ID = Fragen.fall_id";

    $result = $conn->query($sql);
    
    if(!$result) {
        return json_encode(["success" => false, "error" => "Abfragefehler"]);
    }

    $questions = [];
    while($row = $result->fetch_assoc()) {
        $questions[] = $row;
    }
    return json_encode($questions);
}

/**
 * Speichert Demografie und die einzelnen Antworten
 */
function saveAnswers($conn, $data) {
    if (!isset($_SESSION['darf_umfrage_machen']) || $_SESSION['darf_umfrage_machen'] !== true) {
        return json_encode(["success" => false, "error" => "Keine Berechtigung"]);
    }

    if (!$data || !isset($data['demografie']) || !isset($data['antworten'])) {
        return json_encode(["success" => false, "error" => "Unvollständige Daten"]);
    }

    $demo = $data['demografie'];
    $antworten = $data['antworten'];

    // 1. Teilnehmer anlegen
    $sqlTeilnehmer = "INSERT INTO `Teilnehmer` (`geschlecht`, `teilnehmer_alter`,`beschaeftigungsstatus`) VALUES (?, ?, ?)";
    $stmtTeilnehmer = $conn->prepare($sqlTeilnehmer);

    if (!$stmtTeilnehmer) {
        return json_encode(["success" => false, "error" => "Systemfehler Teilnehmer"]);
    }

    $geschlecht = substr($demo['geschlecht'], 0, 50); // Maximal 50 Zeichen
    $beschaeftigungsstatus = substr($demo['beschaeftigungsstatus'], 0, 50);
    $alter = (int)$demo['alter'];

    $stmtTeilnehmer->bind_param("sis", 
        $geschlecht, 
        $alter, 
        $beschaeftigungsstatus
    );

    if (!$stmtTeilnehmer->execute()) {
        return json_encode(["success" => false, "error" => "Speichern fehlgeschlagen"]);
    }

    $teilnehmerId = $conn->insert_id;

    // 2. Antworten in einer Schleife speichern
    $sqlAntwort = "INSERT INTO `Antworten` (`teilnehmer_id`, `frage_id`, `wert`) VALUES (?, ?, ?)";
    $stmtAntwort = $conn->prepare($sqlAntwort);

    if (!$stmtAntwort) {
        return json_encode(["success" => false, "error" => "Systemfehler Antworten"]);
    }

    foreach ($antworten as $frageId => $wert) {
        $fId = (int)$frageId;
        $wVal = (int)$wert;
        $stmtAntwort->bind_param("iii", $teilnehmerId, $fId, $wVal);
        $stmtAntwort->execute();
    }

    unset($_SESSION['darf_umfrage_machen']); 

    return json_encode(["success" => true, "message" => "Daten erfolgreich gespeichert"]);
}

// ROUTING
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getQuestions':
        echo getQuestions($conn); 
        break;
        
    case 'saveAnswers':
        $inputJSON = file_get_contents('php://input');
        $data = json_decode($inputJSON, true);
        echo saveAnswers($conn, $data);
        break;
        
    default:
        echo json_encode(["success" => false, "error" => "Unbekannte Aktion"]);
        break;
}
