<?php

header("Content-Type: application/json; charset=utf-8");

require_once(__DIR__ . "/../auth/verificar_adm.php");
require_once(__DIR__ . "/../config/conexao.php");

$query = "
SELECT
    id_medico,
    nome,
    crm,
    tipo,
    status_medico

FROM medico

ORDER BY nome
";

$stmt = $conexao->prepare($query);

if (!$stmt) {
    echo json_encode([
        "status" => false,
        "mensagem" => "Erro ao preparar query.",
        "erro" => $conexao->error
    ]);
    exit;
}

$stmt->execute();
$resultado = $stmt->get_result();

$medicos = [];

while ($linha = $resultado->fetch_assoc()) {
    $medicos[] = [
        "id_medico" => $linha["id_medico"],
        "nome" => $linha["nome"],
        "crm" => $linha["crm"],
        "tipo" => $linha["tipo"],
        "status" => $linha["status_medico"]
    ];
}

echo json_encode([
    "status" => true,
    "medicos" => $medicos
]);