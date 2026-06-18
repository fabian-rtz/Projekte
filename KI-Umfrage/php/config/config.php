<?php
require_once __DIR__ . '/../../vendor/autoload.php';

define('DB_API', './php/api/db-api.php');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();
