<?php
session_start();
require_once('./php/config/config.php');
require_once('./php/auth/auth.php');

$istEingeloggt = istEingeloggt();
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/division.css">
    <link rel="icon" type="image/x-icon" href="./img/favicon.ico">
    <title>MMA Division</title>
</head>
<body>
    <header>
        <?php include './php/design/navbar.php'; ?>
    </header>
        <h1>Division Rankings</h1>
         <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        <div id="details-container">
          <!-- Wird über division.js dynamisch generiert -->
        </div>
    <script>
        const DB_API  = "<?php echo DB_API; ?>";
        const MMA_API = "<?php echo MMA_API; ?>";
        let istEingeloggt = <?php echo $istEingeloggt ? 'true' : 'false'; ?>;
    </script>
    <script src="./js/division.js"></script>
</body>
</html>