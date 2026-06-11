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
    status

FROM medico

ORDER BY nome
";

$stmt = $conexao->prepare($query);
$stmt->execute();
$resultado = $stmt->get_result();
$medicos = [];

while ($linha = $resultado->fetch_assoc()) {
    $medicos[] = [
        "id_medico" => $linha["id_medico"],
        "nome" => $linha["nome"],
        "crm" => $linha["crm"],
        "tipo" => $linha["tipo"]
    ];
}

echo json_encode([
    "status" => true,
    "medicos" => $medicos
]);