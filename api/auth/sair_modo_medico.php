<?php
header("Content-Type: application/json; charset=utf-8");

session_start();

unset($_SESSION["medico_assumido"]);
unset($_SESSION["nome_medico_assumido"]);

echo json_encode([
    "status" => true
]);

?>