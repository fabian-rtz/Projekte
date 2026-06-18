<?php
include "../database/db.php";

$errors = [];

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['registration'])) {

    $vorname             = trim($_POST["vorname"]);
    $nachname            = trim($_POST["nachname"]);
    $username            = trim($_POST["username"]);
    $firstCheckPassword  = trim($_POST["firstCheckPassword"]);
    $secondCheckPassword = trim($_POST["secondCheckPassword"]);
    $email               = trim($_POST["email"]);
    $geburtsdatum        = trim($_POST["geburtsdatum"]);

    if ($firstCheckPassword !== $secondCheckPassword) {
        $errors[] = "Passwörter stimmen nicht überein!";
    } else {
        $password = $firstCheckPassword;
    }

    if (empty($errors)) {
        $password = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO Benutzer (`Benutzername`, `Passwort`, `Vorname`, `Nachname`, `Email`, `Geburtsdatum`) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $username, $password, $vorname, $nachname, $email, $geburtsdatum);

        if ($stmt->execute()) {
            header("Location: login.php");
            exit;
        } else {
            if ($conn->errno === 1062) {
                $errors[] = "Benutzername bereits vergeben!";
            } else {
                $errors[] = "Fehler beim Registrieren, bitte erneut versuchen.";
            }
        }
        $stmt->close();
    }
}
?>


<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../../css/registration.css">
    <link rel="icon" type="image/x-icon" href="../../img/favicon.ico">
    <title>Registrierung</title>
</head>
<body>
    <div class="registration-outer-container">
        <img src="../../img/LoginWallpaper.jpg">
        <div class="registration-inner-container">
            <?php if (!empty($errors)): ?>
                <div class="errors">
                    <?php foreach ($errors as $error): ?>
                        <p><?php echo $error; ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <form action="" method="post">
                <div class="input-container">
                    <label for="vorname">Vorname</label>
                    <input type="text" name="vorname" id="vorname" required>
                </div>
                <div class="input-container">
                    <label for="nachname">Nachname</label>
                    <input type="text" name="nachname" id="nachname" required>
                </div>
                <div class="input-container">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" required>
                </div>
                <div class="input-container">
                    <label for="geburtsdatum">Geburtsdatum</label>
                    <input type="date" name="geburtsdatum" id="geburtsdatum" required>
                </div>
                <div class="input-container">
                    <label for="username">Benutzername</label>
                    <input type="text" name="username" id="username" required>
                </div>
                <div class="input-container">
                    <label for="firstCheckPassword">Passwort eingeben</label>
                    <input type="password" name="firstCheckPassword" id="firstCheckPassword" required>
                </div>
                <div class="input-container">
                    <label for="secondCheckPassword">Passwort erneut eingeben</label>
                    <input type="password" name="secondCheckPassword" id="secondCheckPassword" required>
                </div>
                <input type="submit" value="registrieren" name="registration" class="submit-btn">
            </form>
        </div>
    </div>
</body>
</html>