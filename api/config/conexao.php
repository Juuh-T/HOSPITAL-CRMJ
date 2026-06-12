
<?php

require_once(__DIR__ . "/../../config/config.php");

$conexao = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);

if ($conexao->connect_error) {
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        "status" => false,
        "mensagem" => "Erro na conexao com o banco de dados.",
        "erro" => $conexao->connect_error
    ]);
    exit;
}

$conexao->set_charset(DB_CHARSET);

?>
