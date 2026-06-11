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

if ($_SESSION["tipo"] === "ADM" && isset($_SESSION["medico_assumido"])) {
    $id_medico = $_SESSION["medico_assumido"];
} else {
    $id_medico = $_SESSION["id_medico"];
}

$query = "
SELECT
    p.id_paciente,
    p.nome,
    p.idade,
    p.peso,
    p.cpf_paciente,

    a.nome AS nome_acompanhante,
    a.cpf_acompanhante,
    a.telefone,

    e.sintoma_deficiencia_intelectual,
    e.sintoma_face_alongada_orelhas,
    e.sintoma_macroorquidismo,
    e.sintoma_hipermobilidade_articular,
    e.sintoma_dificuldade_aprendizagem,
    e.sintoma_deficit_atencao,
    e.sintoma_movimentos_repetitivos,
    e.sintoma_atraso_fala,
    e.sintoma_hiperatividade,
    e.sintoma_evita_contato_visual,
    e.sintoma_evita_contato_fisico,
    e.sintoma_agressividade,

    e.foto_paciente_1

FROM autorizacoes_medicas am

INNER JOIN paciente p
    ON am.paciente_id = p.id_paciente

LEFT JOIN acompanhante a
    ON a.paciente_id = p.id_paciente

LEFT JOIN examen e
    ON e.paciente_id = p.id_paciente

WHERE am.medico_id = ?

ORDER BY p.nome
";

$stmt = $conexao->prepare($query);
$stmt->bind_param("i", $id_medico);
$stmt->execute();
$resultado = $stmt->get_result();
$pacientes[] = [
    
    "id_paciente" => $linha["id_paciente"],
    "nome" => $linha["nome"],
    "idade" => $linha["idade"],
    "peso" => $linha["peso"],
    "cpf_paciente" => $linha["cpf_paciente"],

    "acompanhante" => [
        "nome" => $linha["nome_acompanhante"],
        "cpf" => $linha["cpf_acompanhante"],
        "telefone" => $linha["telefone"]
    ],

    "checklist" => [

        "deficiencia_intelectual" => $linha["sintoma_deficiencia_intelectual"],
        "face_alongada_orelhas" => $linha["sintoma_face_alongada_orelhas"],
        "macroorquidismo" => $linha["sintoma_macroorquidismo"],
        "hipermobilidade_articular" => $linha["sintoma_hipermobilidade_articular"],
        "dificuldade_aprendizagem" => $linha["sintoma_dificuldade_aprendizagem"],
        "deficit_atencao" => $linha["sintoma_deficit_atencao"],
        "movimentos_repetitivos" => $linha["sintoma_movimentos_repetitivos"],
        "atraso_fala" => $linha["sintoma_atraso_fala"],
        "hiperatividade" => $linha["sintoma_hiperatividade"],
        "evita_contato_visual" => $linha["sintoma_evita_contato_visual"],
        "evita_contato_fisico" => $linha["sintoma_evita_contato_fisico"],
        "agressividade" => $linha["sintoma_agressividade"]

    ],

    "foto" => $linha["foto_paciente_1"]

];

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