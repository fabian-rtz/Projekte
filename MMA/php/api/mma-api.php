<?php
$trusteddomain = "http://localhost:4000";
header("Access-Control-Allow-Origin: $trusteddomain");
header("Content-Type: application/json");

require_once '../config/config.php';

//MMA Schedule 
function getSchedule(){
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/schedule?year=2022",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }

}

//Get playerIds
function searchPlayerIDs($player){
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/playerIds?playerName=".rawurlencode($player),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }
}

//Divisional Rankings
function getDivisionalRankings(){
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/drankings",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }
}

//Divisional Rankings Ids
function getDivisionalRankingsIds(){
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/drankings/ids",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }
}

//Get Event Id
function getEventId($year){
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/getEventId?year=".urlencode($year),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }
}

//MMA Fighter Profile
function getFighterProfile($fighterID){
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/player-profile?fighterId=".urlencode($fighterID),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }
}

//MMA Scoreboard
function getScoreboard(){
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/scoreboard",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }
}

//MMA Scoreboard by Event
function getScoreboardByID($eventID){
    $curl = curl_init();
    $eventID = urlencode(trim($eventID));
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/scoreboard-by-event?eventId=".urlencode($eventID),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }
}

//Fighter Details
function getFighterDetails($fighterID){
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/player-details?fighterId=".urlencode($fighterID),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    } 
}
//MMA News
function getNews(){
 
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => "https://mma-api1.p.rapidapi.com/news",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "x-rapidapi-host: mma-api1.p.rapidapi.com",
            "x-rapidapi-key: " . $_ENV['RAPIDAPI_KEY']
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);  
    if ($err) {
        return json_encode(["error" => $err]);
    } else {
        return $response;
    }  
}

// Router
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'schedule':
        echo getSchedule();
        break;

    case 'search':
        $player = trim($_GET['player'] ?? '');
        if (empty($player)) {
            echo json_encode(["error" => "Parameter 'player' fehlt"]);
            break;
        }
        echo searchPlayerIDs($player);
        break;

    case 'rankings':
        echo getDivisionalRankings();
        break;

    case 'rankingsIds':
        echo getDivisionalRankingsIds();
        break;

    case 'eventId':
        $year = trim($_GET['year'] ?? '');
        if (!preg_match('/^\d{4}$/', $year)) {
            echo json_encode(["error" => "Ungültiges Jahr"]);
            break;
        }
        echo getEventId($year);
        break;

    case 'fighterProfile':
        $fighterId = trim($_GET['fighterId'] ?? '');
        if (empty($fighterId) || !ctype_alnum($fighterId)) {
            echo json_encode(["error" => "Ungültige fighterId"]);
            break;
        }
        echo getFighterProfile($fighterId);
        break;

    case 'scoreboard':
        echo getScoreboard();
        break;

    case 'fighterDetails':
        $fighterId = trim($_GET['fighterId'] ?? '');
        if (empty($fighterId) || !ctype_alnum($fighterId)) {
            echo json_encode(["error" => "Ungültige fighterId"]);
            break;
        }
        echo getFighterDetails($fighterId);
        break;

    case 'scoreboardByID':
        $eventID = trim($_GET['eventID'] ?? '');
        if (empty($eventID) || !ctype_alnum($eventID)) {
            echo json_encode(["error" => "Ungültige eventID"]);
            break;
        }
        echo getScoreboardByID($eventID);
        break;

    case 'news':
        echo getNews();
        break;

    default:
        http_response_code(400);
        echo json_encode(["error" => "Unbekannte Action"]);
        break;
}