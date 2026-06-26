<?php
    session_start();   

    require_once('./php/config/config.php');

    // 1. Prüfen, ob Nutzer ausgeschlossen ist (Klick auf "Nein")
    if (isset($_COOKIE['ausgeschlossen']) && $_COOKIE['ausgeschlossen'] == "ja") {
        header("Location: index.php");
        exit;
    }

    // 2. Prüfen, ob die Umfrage bereits erfolgreich beendet wurde
    if (isset($_COOKIE['abgeschlossen']) && $_COOKIE['abgeschlossen'] == "ja") {
        header("Location: index.php");
        exit;
    }

    // 3. Prüfen, ob der Stempel "darf Umfrage machen" (Klick auf "Ja") fehlt
    if (!isset($_SESSION['darf_umfrage_machen']) || $_SESSION['darf_umfrage_machen'] !== true) {
        header("Location: index.php");
        exit;
    }

?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KI-Umfrage</title>
    <link rel="stylesheet" href="./css/umfrage.css">
     <script data-goatcounter="https://fabianrtz.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
</head>
<body>
    <main>
    <div id="question-container-outer">

    </div>
    </main>
    <script>
        const DB_API  = "<?php echo DB_API; ?>";
    </script>
    <script src="./js/umfrage.js"></script>
</body>
</html>
