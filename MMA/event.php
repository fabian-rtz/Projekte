<?php
    session_start();
    require_once('./php/config/config.php');
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/event.css">
    <link rel="icon" type="image/x-icon" href="./img/favicon.ico">
    <title>MMA Event</title>
</head>
<body>
    <header>
        <?php include './php/design/navbar.php'; ?>
    </header>

    <div class="selection-container">
        <select name="" id="EventSelector" onchange="getEventsByYear(this.value,false)">
            <option value="">Wähle ein Jahr</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
        </select>
    </div>

    <div id="table-container"></div>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    <div id="event-main-container"></div>
    <script>
        const DB_API  = "<?php echo DB_API; ?>";
        const MMA_API = "<?php echo MMA_API; ?>";
    </script>
    <script src="./js/event.js"></script>
</body>
</html>