<?php
    require_once(__DIR__ . '/../auth/auth.php');

    $username = $_SESSION['username'] ?? '';
?>
<head>
    <link rel="stylesheet" href="./css/navbar.css">
</head>
<div class="header-container">
    <p class="pNavbarHeader">UFC</p>
    <nav>
        <a href="index.php">Home</a>
        <a href="division.php">Division</a>
        <a href="statistiken.php">Statistiken</a>
        <a href="event.php">Events</a>
        <a href="favoriten.php">Favoriten</a>
        <a href="news.php">News</a>
    </nav>
    <div class="button-container">
        <?php if(!istEingeloggt()){?>
        <form action="./php/auth/login.php" method="post">
            <input type="submit" value="Einloggen" name="login-nav">
        </form>
        <form action="./php/auth/registration.php" method="post">
            <input type="submit" value="Registrieren" name="registrieren">
        </form>  
        <?php } else { ?>
        <div class="username-container">
            <div class="username-logout">
                <p><?php echo htmlspecialchars($username); ?></p>
                <form action="./php/auth/logout.php" method="post">
                    <button type="submit"><img src="./img/switch.png"></button>
                </form>            
            </div>
            <img src="./img/boxing.png">
        </div>
        <?php } ?>
    </div>
</div>
<script>
    const links = document.querySelectorAll('nav a');
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('red');
        }
    });
</script>
