<?php
// 1. Composer & .env laden
require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$dotenv->required(['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']);

mysqli_report(MYSQLI_REPORT_OFF);

$conn = mysqli_connect(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASSWORD'],
    $_ENV['DB_NAME']
);


if (!$conn) {
    error_log("DB-Verbindung fehlgeschlagen: " . mysqli_connect_error()); // Schreibt in die Server-Logs
    die("Ein technischer Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."); // Das sieht der Nutzer
}

mysqli_set_charset($conn, "utf8mb4");
?>
