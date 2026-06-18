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
    <link rel="stylesheet" href="./css/statistiken.css">
    <link rel="icon" type="image/x-icon" href="./img/favicon.ico">
    <title>MMA Statistiken</title>
</head>
<body>
    <header>
        <?php include './php/design/navbar.php'; ?>
    </header>
    <div class="styling-container">
        <div class="left-fighter-container">
            <input type="text" name="" id="searchFighter-left" placeholder="Suche Kämpfer links...">
            <div id="left-search-container"></div>
            <?php if(istEingeloggt()) { ?>
            <form action="" method="post" onSubmit="setFavouriteFighterLeft();return false;">   
                <button type="submit" name="favourite-btn-left" id="favourite-btn-left"><img id="favourite-img-left" src="../MMA/img/favourite_black.png"></button>
            </form>  
            <?php } else { ?>
            <?php } ?>    
            <div class="lds-ring-left"><div></div><div></div><div></div><div></div></div>
            <div id="fighter-card-left"> </div>
        </div>
        <div class="VSContainer">
            <p>VS</p>
        </div>
        <div class="right-fighter-container">
            <input type="text" name="" id="searchFighter-right" placeholder="Suche Kämpfer rechts...">
            <div id="right-search-container"></div>
            <?php if(istEingeloggt()) { ?>
            <form action="" method="post" onSubmit="setFavouriteFighterRight();return false;">      
                <button id="favourite-btn-right"><img id="favourite-img-right" src="../MMA/img/favourite_black.png" onClick="setFavouriteFighterRight()"></button>            
            </form>  
            <?php } else { ?>
            <?php } ?> 
            <div class="lds-ring-right"><div></div><div></div><div></div><div></div></div>
            <div id="fighter-card-right"></div>     
        </div>
    </div>
    <script>
        const DB_API  = "<?php echo DB_API; ?>";
        const MMA_API = "<?php echo MMA_API; ?>";
    </script>    
    <script src="./js/statistiken.js"></script>
</body>
</html>