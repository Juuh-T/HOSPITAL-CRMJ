<?php

header("Content-Type: application/json; charset=utf-8");
session_start();

require_once(__DIR__ . "/../config/conexao.php");

if (!isset($_SESSION["id_medico"])) {
    echo json_encode([
        "status" => false,
        "mensagem" => "Sessão inválida."
    ]);
    exit;
}

$id_medico = $_SESSION["id_medico"];

$query = "
SELECT
    p.id_paciente,
    p.nome,
    p.idade,
    p.peso,
    p.cpf_paciente

FROM autorizacoes_medicas am

INNER JOIN paciente p
    ON am.paciente_id = p.id_paciente

WHERE am.medico_id = ?

ORDER BY p.nome
";

$stmt = $conexao->prepare($query);
$stmt->bind_param("i", $id_medico);
$stmt->execute();
$resultado = $stmt->get_result();
$pacientes = [];

while ($linha = $resultado->fetch_assoc()) {

    $pacientes[] = [
        "id_paciente" => $linha["id_paciente"],
        "nome" => $linha["nome"],
        "idade" => $linha["idade"],
        "peso" => $linha["peso"],
        "cpf_paciente" => $linha["cpf_paciente"]
    ];
}

echo json_encode([
    "status" => true,
    "pacientes" => $pacientes
]);