<?php
include "../database/db.php";
session_start();

$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["login"])) {

    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);

    if (empty($username) || empty($password)) {
        $errors[] = "Bitte alle Felder ausfüllen";
    } else {
        $stmt = $conn->prepare("SELECT Benutzer_ID, Benutzername, Passwort FROM Benutzer WHERE Benutzername = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if ($user && password_verify($password, $user["Passwort"])) {

            $_SESSION['user_id'] = $user['Benutzer_ID'];
            $_SESSION['username'] = $user['Benutzername'];

            $log = $conn->prepare("INSERT INTO Logging (Beschreibung, Benutzer_ID) VALUES (?, ?)");
            $beschreibung = "Benutzer hat sich eingeloggt";
            $log->bind_param("si", $beschreibung, $user['Benutzer_ID']);
            $log->execute();
            $log->close();

            header("Location: ../../index.php");
            exit();
        } else {
            $errors[] = "Benutzername oder Passwort falsch";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../css/login.css">
    <link rel="icon" type="image/x-icon" href="../../img/favicon.ico">
    <title>Login</title>
</head>
<body>
    <div class="login-outer-container">
        <img src="../../img/LoginWallpaper.jpg">
        <div class="login-inner-container">
            <?php if (!empty($errors)): ?>
                <div class="errors">
                    <?php foreach ($errors as $error): ?>
                        <p><?php echo $error; ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <form action="" method="post">
                <div class="input-container">
                    <label for="username">Benutzername</label>
                    <input type="text" name="username" id="username">
                </div>
                <div class="input-container">
                    <label for="password">Passwort</label>
                    <input type="password" name="password" id="password">
                </div>
                <input type="submit" value="Login" name="login" class="submit-btn">
            </form>
            <p>Noch keinen Account? <a href="./registration.php">Hier</a> klicken zum registrieren</p>
        </div>
    </div>
</body>
</html>
