<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../src/Database.php';
require_once __DIR__ . '/../src/Api.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));
$table = array_shift($request);
$data = json_decode(file_get_contents("php://input"), true);

$database = new Database();
$db = $database->getConnection();
$api = new Api($db);

if ($method == 'POST' && !empty($table) && !empty($data)) {
    $response = $api->addRecord($table, $data);
    echo json_encode($response);
} else {
    echo json_encode(array("message" => "Invalid request."));
}
?>
