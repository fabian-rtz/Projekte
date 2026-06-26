<?php
session_start(); 

$gemerkte_antwort = "";
$umfrage_zuende = "";

// 1. Prüfen, ob der Nutzer die Umfrage bereits komplett abgeschlossen hat (NEU)
if(isset($_COOKIE['abgeschlossen']) && $_COOKIE['abgeschlossen'] == "ja"){
    $umfrage_zuende = "ja";
    $gemerkte_antwort = "abgeschlossen"; // Damit die Start-Frage nicht mehr erscheint
}

// 2. Prüfen, ob der Nutzer wegen "Nein" ausgeschlossen wurde
if(isset($_COOKIE['ausgeschlossen']) && $_COOKIE['ausgeschlossen'] == "ja"){
    $gemerkte_antwort = "nein"; 
}

// 3. Button-Klicks verarbeiten
if(isset($_POST['antwort'])){
    $gemerkte_antwort = $_POST['antwort'];

    if($gemerkte_antwort == "ja"){
        $_SESSION['darf_umfrage_machen'] = true; 
        
        header("Location: umfrage.php"); 
        exit; 
    } 

    if($gemerkte_antwort == "nein"){

        $_SESSION['darf_umfrage_machen'] = false; 
        setcookie("ausgeschlossen", "ja", time() + (60 * 60 * 24 * 30), "/");
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KI-Umfrage</title>
    <link rel="stylesheet" href="./css/index.css">
     <script data-goatcounter="https://fabianrtz.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</head>
<body>
    <main>
        <div class="question-container">
            <?php if($umfrage_zuende == "ja"){ ?>
                 <!-- Fall A: Umfrage bereits fertig -->
                 <p>Die Umfrage ist zu Ende.<br>Vielen Dank für Ihre Teilnahme!</p> 

            <?php } elseif($gemerkte_antwort == "nein") { ?>
                <!-- Fall B: Ausgeschlossen wegen "Nein" -->
                <p>Vielen Dank!</p>
                <p>Leider sind Sie für diese Umfrage nicht qualifiziert.</p>        

            <?php } else { ?>
                <!-- Fall C: Normale Startseite -->
                <p>Haben Sie bereits Anwendungen mit Künstlicher Intelligenz (wie z. B. ChatGPT, Bildgeneratoren oder KI-Produktempfehlungen) genutzt?</p>
                <form method="POST">
                    <button type="submit" name="antwort" value="ja">Ja</button>
                    <button type="submit" name="antwort" value="nein">Nein</button>
                </form>
            <?php } ?>     
        </div>
    </main>
</body>
</html>
