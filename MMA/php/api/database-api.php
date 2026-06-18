<?php
$trusteddomain = "http://localhost:4000";
header("Access-Control-Allow-Origin: $trusteddomain");
header("Content-Type: application/json");

session_start();

require_once __DIR__ . '/../database/db.php';

if(!$conn){
    echo json_encode(["error" => "DB Verbindung fehlgeschlagen"]);
    exit;
}
function getChat($conn){
    $sql = "SELECT Chat.Chat, Benutzer.Benutzername, Chat.Date
            FROM Chat 
            JOIN Benutzer ON Chat.Benutzer_ID = Benutzer.Benutzer_ID";

    $result = $conn->query($sql);

    $chat = [];
    while($row = $result->fetch_assoc()) {
        $chat[] = $row;
    }
   
    return json_encode($chat);
}

function setChat($conn){

    if (!isset($_SESSION['user_id'])) {
        return json_encode(["error" => "Nicht eingeloggt"]);
    }
    $user_id = $_SESSION['user_id'];
    $message = htmlspecialchars(trim($_POST['message']));
    
    if (empty($message)) {
        return json_encode(["error" => "Nachricht darf nicht leer sein"]);
    }

    if (strlen($message) > 500) {
        return json_encode(["error" => "Nachricht zu lang"]);
    }

    $stmt = $conn->prepare("INSERT INTO Chat (Chat, Benutzer_ID) VALUES (?, ?)");
    $stmt->bind_param("si", $message, $user_id);
    $stmt->execute();

    return json_encode(["success" => true]);
}
function setFavouriteFighter($conn){
    $fighter_id = $_POST['fighter_id'];
    if (!isset($_SESSION['user_id'])) {
        return json_encode(false);
    }
    $user_id = $_SESSION['user_id']; 

    
    $stmt = $conn->prepare("INSERT INTO Favoriten (Benutzer_ID, Fighter_ID) VALUES (?, ?)");
    $stmt->bind_param("ii",$user_id , $fighter_id);
    $stmt->execute();

    setLogging('Kämpfer('.$fighter_id.') wurde als favorit gesetzt', $conn);

    return json_encode(["success" => true]);
}

function getFavouriteFighter($conn, $fighter_id) {
    if (!isset($_SESSION['user_id'])) {
        return json_encode(false);
    }
    $user_id = $_SESSION['user_id']; 

    $stmt = $conn->prepare("SELECT * FROM Favoriten WHERE Benutzer_ID = ? AND Fighter_ID = ?");
    $stmt->bind_param("ii", $user_id, $fighter_id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    $isFavourite = $result->fetch_assoc() ? true : false;

    return json_encode($isFavourite);
}

function deleteFavouriteFighter($conn,$fighter_id){
    if (!isset($_SESSION['user_id'])) {
        return json_encode(false);
    }
    $user_id = $_SESSION['user_id']; 
    $stmt = $conn->prepare("DELETE FROM Favoriten WHERE Benutzer_ID = ? AND Fighter_ID = ?");
    $stmt->bind_param("ii", $user_id, $fighter_id);
    $stmt->execute();

    setLogging('Kämpfer('.$fighter_id.') wurde aus Favoriten gelöscht',$conn);
    
    return json_encode(["success" => true]);
}

function getAllFavouriteFighters($conn) {
    if (!isset($_SESSION['user_id'])) {
        return json_encode(false);
    }
    $user_id = $_SESSION['user_id'];

    $stmt = $conn->prepare("SELECT Fighter_ID FROM Favoriten WHERE Benutzer_ID = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();

    $result = $stmt->get_result();

    $fighters = [];
    while($row = $result->fetch_assoc()) {
        $fighters[] = $row;
    }

    return json_encode($fighters);
}

function setLogging($beschreibung,$conn){
    $user_id = $_SESSION['user_id'];
    
    $log = $conn->prepare("INSERT INTO Logging (Beschreibung, Benutzer_ID) VALUES (?, ?)");
    $log->bind_param("si", $beschreibung, $user_id);
    $log->execute();
    $log->close();
}


$action = $_GET['action'] ?? '';
switch ($action) {
    case 'getChat':
        echo getChat($conn);  
        break;
    case 'setChat':
        echo setChat($conn);  
        break;
    case 'setFavouriteFighter':
        echo setFavouriteFighter($conn);  
        break; 
    case 'getFavouriteFighter':
        echo getFavouriteFighter($conn,$_GET['fighterId']);  
        break;  
    case 'deleteFavouriteFighter':
        echo deleteFavouriteFighter($conn,$_GET['fighterId']);  
        break; 
    case 'getAllFavouriteFighters':
        echo getAllFavouriteFighters($conn);  
        break;                      
}

