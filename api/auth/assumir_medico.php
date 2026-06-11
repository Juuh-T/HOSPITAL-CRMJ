<?php

header("Content-Type: application/json; charset=utf-8");
session_start();
require_once("../config/conexao.php");

if (!isset($_SESSION["id_medico"])) {
    echo json_encode([
        "status" => false,
        "mensagem" => "Usuário não autenticado."
    ]);
    exit;
}

if ($_SESSION["tipo"] !== "ADM") {
    echo json_encode([
        "status" => false,
        "mensagem" => "Acesso negado."
    ]);
    exit;
}

$resposta = json_decode(file_get_contents("php://input"), true);

$id_medico = $resposta["id_medico"] ?? 0;

if ($id_medico <= 0) {
    echo json_encode([
        "status" => false,
        "mensagem" => "Médico inválido."
    ]);
    exit;
}

$query = "
SELECT id_medico, nome
FROM medico
WHERE id_medico = ?
";

$stmt = $conexao->prepare($query);
$stmt->bind_param("i", $id_medico);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows !== 1) {
    echo json_encode([
        "status" => false,
        "mensagem" => "Médico não encontrado."
    ]);
    exit;
}

$medico = $resultado->fetch_assoc();
$_SESSION["medico_assumido"] = $medico["id_medico"];
$_SESSION["nome_medico_assumido"] = $medico["nome"];


echo json_encode([
    "status" => true,
    "mensagem" => "Médico selecionado com sucesso."
]);

?>