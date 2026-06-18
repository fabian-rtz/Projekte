<?php
    session_start();
    require_once('./php/config/config.php');
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/favoriten.css">
    <link rel="icon" type="image/x-icon" href="./img/favicon.ico">
    <title>MMA Favoriten</title>
</head>
<body>
    <header>
        <?php include './php/design/navbar.php'; ?>
    </header>
    <h1>Favoriten</h1>
    <div class="legend-container">
        <div class="legend-inner">
            <div class="legend-item">
                <p class="legend-label">Division:</p>
                <p class="legend-value">Gewichtsklasse</p>
            </div>
            <div class="legend-item">
                <p class="legend-label">Record:</p>
                <p class="legend-value">Siege - Niederlagen - Unentschieden</p>
            </div>
        </div>
    </div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    <div id="table-container"></div>
    <script>
        const DB_API  = "<?php echo DB_API; ?>";
        const MMA_API = "<?php echo MMA_API; ?>";
    </script>
    <script src="./js/favoriten.js"></script>
</body>
</html>