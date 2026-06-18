<?php
require_once __DIR__ . '/../../vendor/autoload.php';

define('DB_API',    '../MMA/php/api/' . '/database-api.php');
define('MMA_API',  '../MMA/php/api/'  . '/mma-api.php');

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

$dotenv->required('RAPIDAPI_KEY');