<?php
    session_start();

    require_once './php/auth/auth.php';
    require_once('./php/config/config.php');

    $formHTML = istEingeloggt() 
    ? '<form id="chat-form">
        <input id="message-input" type="text" name="message-input" required>
        <button id="send-message-btn" type="submit">Senden</button>
       </form>'
    : '<form id="chat-form">
        <input id="message-input" type="text" name="message-input" required disabled>
        <button id="send-message-btn-disabled" type="submit" disabled>Senden</button>
       </form>';
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/index.css">
    <link rel="icon" type="image/x-icon" href="./img/favicon.ico">
    <title>UFC Stats Viewer</title>
</head>
<body>
    <header>
        <?php include './php/design/navbar.php'; ?>
    </header>
    <div class="section-placing">
        <section id="section-left-side">
            <h1>Veranstaltungen</h1>
            <div class="events-outer-container">
                <select id="event-selector" onchange="loadScheduledEvents(this.value)">          
                    <option value="All">Alle</option>
                    <option value="Upcoming">Bevorstehend</option>
                </select>
                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                <div id="events-inner-container">
              
                </div>
            </div>
        </section>
        <section id="section-right-side">
            <h2>Chat</h2>
            <div id="chat-container">
                <!--Dynamisch generiert durch script.js -->
            </div>
        </section>
    </div>
<script>
    const formHTML = <?php echo json_encode($formHTML); ?>;
    const DB_API  = "<?php echo DB_API; ?>";
    const MMA_API = "<?php echo MMA_API; ?>";
</script>
<script src="./js/indexChat.js"></script>
<script src="./js/indexEvents.js"></script>

</body>
</html>