<?php
require_once __DIR__ . '/../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$dotenv->required(['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']);

mysqli_report(MYSQLI_REPORT_OFF);

$conn = mysqli_connect(
    $_ENV['DB_HOST'],
    $_ENV['DB_USER'],
    $_ENV['DB_PASSWORD']
);

if (!$conn) {
    die("Verbindung fehlgeschlagen: " . mysqli_connect_error());
}

// setup.sql nur einmalig ausführen
if (!file_exists(__DIR__ . '/setup.done')) {
    $sql = file_get_contents(__DIR__ . '/db.sql');
    
    if (!mysqli_multi_query($conn, $sql)) {
        die("SQL Fehler: " . mysqli_error($conn));
    }
    
    do {
        if ($res = mysqli_store_result($conn)) {
            mysqli_free_result($res);
        }
    } while (mysqli_next_result($conn));
    
    file_put_contents(__DIR__ . '/setup.done', 'done');
}

if (!mysqli_select_db($conn, $_ENV['DB_NAME'])) {
    die("DB select fehlgeschlagen: " . mysqli_error($conn));
}

mysqli_select_db($conn, $_ENV['DB_NAME']);