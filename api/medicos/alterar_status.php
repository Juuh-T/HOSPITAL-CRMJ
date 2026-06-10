<?php

header("Content-Type: application/json; charset=utf-8");
require_once("../config/conexao.php");

session_start();

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
$novo_status = $resposta["status"] ?? "";

if ($id_medico == $_SESSION["id_medico"] && $novo_status != "ATIVO") {
    echo json_encode([
        "status" => false,
        "mensagem" => "Você não pode alterar seu próprio status."
    ]);
    exit;
}

$status_validos = ["ATIVO", "FERIAS", "DESATIVADO"];

if (!in_array($novo_status, $status_validos)) {
    echo json_encode([
        "status" => false,
        "mensagem" => "Status inválido."
    ]);
    exit;
}

$query = "
    UPDATE medico
    SET status = ?
    WHERE id_medico = ?
";

$stmt = $conexao->prepare($query);
$stmt->bind_param("si", $novo_status, $id_medico);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "status" => true,
            "mensagem" => "Status alterado com sucesso."
        ]);
    } else {
        echo json_encode([
            "status" => false,
            "mensagem" => "Médico não encontrado."
        ]);
    }
} else {
    echo json_encode([
        "status" => false,
        "mensagem" => "Erro ao alterar status."
    ]);
}

?>