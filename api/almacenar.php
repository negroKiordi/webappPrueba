<?php

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../src/database.php';
require_once __DIR__ . '/../src/api.php';

//require_once("../config.php");
//require_once("../src/database.php");
//require_once("../src/api.php");

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"), true);

if ($method == 'POST' && !empty($data) && !empty($data['table'])) {
    $table = $data['table'];
    unset($data['table']);  // Remove table from data as it's not a column in the table

    $database = new Database();
    $db = $database->getConnection();
    $api = new Api($db);

    $response = $api->addRecord($table, $data);
    echo json_encode($response);
} else {
    echo json_encode(array("message" => "Invalid request chau :("));
}
