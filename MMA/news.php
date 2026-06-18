<?php
    session_start();

    require_once './php/auth/auth.php';
    require_once('./php/config/config.php');
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/news.css">
    <link rel="icon" type="image/x-icon" href="./img/favicon.ico">
    <title>MMA Statistiken</title>
</head>
<body>
    <header>
        <?php include './php/design/navbar.php'; ?>
    </header>
    <h1 class="pNews">News</h1>
    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    <div id="news-outer-container"></div>
<script>
    const DB_API  = "<?php echo DB_API; ?>";
    const MMA_API = "<?php echo MMA_API; ?>";
</script>
<script src="./js/news.js"></script>
</body>

</html>