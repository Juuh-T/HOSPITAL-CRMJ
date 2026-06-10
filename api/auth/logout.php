
<?php
header("Content-Type: application/json; charset=utf-8");

session_start();

$_SESSION = [];

session_destroy();

echo json_encode([
    "status" => true,
    "mensagem" => "Logout realizado."
]);
?>