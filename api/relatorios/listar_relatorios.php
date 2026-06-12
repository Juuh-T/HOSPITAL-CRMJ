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

function calcularScoreRelatorio($linha) {
    $sintomas = [
        ["sintoma_deficiencia_intelectual", 0.32, 0.20],
        ["sintoma_face_alongada_orelhas", 0.29, 0.09],
        ["sintoma_macroorquidismo", 0.26, 0.00],
        ["sintoma_hipermobilidade_articular", 0.19, 0.04],
        ["sintoma_dificuldade_aprendizagem", 0.18, 0.28],
        ["sintoma_deficit_atencao", 0.17, 0.12],
        ["sintoma_movimentos_repetitivos", 0.17, 0.05],
        ["sintoma_atraso_fala", 0.14, 0.01],
        ["sintoma_hiperatividade", 0.12, 0.04],
        ["sintoma_evita_contato_visual", 0.06, 0.08],
        ["sintoma_evita_contato_fisico", 0.04, 0.07],
        ["sintoma_agressividade", 0.01, 0.02]
    ];

    $score = 0;
    $masculino = ($linha["sexo"] ?? "") === "Masculino";

    foreach ($sintomas as $sintoma) {
        if ((int)$linha[$sintoma[0]] === 1) {
            $score += $masculino ? $sintoma[1] : $sintoma[2];
        }
    }

    return number_format($score, 2, ".", "");
}

$resposta = json_decode(
    file_get_contents("php://input"),
    true
);

if (!is_array($resposta)) {
    $resposta = [];
}

$pesquisaPaciente = $resposta["pesquisaPaciente"] ?? "";
$nomeMedico = $resposta["nomeMedico"] ?? "";

$diaInicio = $resposta["diaInicio"] ?? "";
$mesInicio = $resposta["mesInicio"] ?? "";
$anoInicio = $resposta["anoInicio"] ?? "";

$diaFinal = $resposta["diaFinal"] ?? "";
$mesFinal = $resposta["mesFinal"] ?? "";
$anoFinal = $resposta["anoFinal"] ?? "";

$dataInicio = "";
$dataFinal = "";

if (
    $diaInicio !== "" &&
    $mesInicio !== "" &&
    $anoInicio !== ""
) {
    $dataInicio =
        $anoInicio . "-" .
        $mesInicio . "-" .
        $diaInicio;
}

if (
    $diaFinal !== "" &&
    $mesFinal !== "" &&
    $anoFinal !== ""
) {
    $dataFinal =
        $anoFinal . "-" .
        $mesFinal . "-" .
        $diaFinal;
}

$query = "
    SELECT
        e.id_exame,
        e.data_exame,
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
        m.nome AS nome_medico,
        p.nome AS nome_paciente,
        p.sexo,
        p.cpf_paciente
    FROM examen e
    INNER JOIN paciente p
        ON e.paciente_id = p.id_paciente
    INNER JOIN autorizacoes_medicas a
        ON a.paciente_id = p.id_paciente
    INNER JOIN medico m
        ON a.medico_id = m.id_medico
    WHERE 1 = 1
";

$tipos = "";
$valores = [];

if ($_SESSION["tipo"] !== "ADM") {
    $query .= " AND m.id_medico = ?";
    $tipos .= "i";
    $valores[] = $_SESSION["id_medico"];
}

if ($pesquisaPaciente !== "") {
    $query .= " AND (p.nome LIKE ? OR p.cpf_paciente LIKE ?)";
    $tipos .= "ss";
    $busca = "%" . $pesquisaPaciente . "%";
    $valores[] = $busca;
    $valores[] = $busca;
}

if ($nomeMedico !== "") {
    $query .= " AND m.nome LIKE ?";
    $tipos .= "s";
    $valores[] = "%" . $nomeMedico . "%";
}

if ($dataInicio !== "") {
    $query .= " AND DATE(e.data_exame) >= ?";
    $tipos .= "s";
    $valores[] = $dataInicio;
}

if ($dataFinal !== "") {
    $query .= " AND DATE(e.data_exame) <= ?";
    $tipos .= "s";
    $valores[] = $dataFinal;
}

$query .= " ORDER BY e.data_exame DESC";
$stmt = $conexao->prepare($query);
if (!$stmt) {
    echo json_encode([
        "status" => false,
        "mensagem" => "Erro na query: " . $conexao->error
    ]);
    exit;
}

if (!empty($valores)) {

    $stmt->bind_param(
        $tipos,
        ...$valores
    );
}

$stmt->execute();
$resultado = $stmt->get_result();
$relatorios = [];

while ($linha = $resultado->fetch_assoc()) {
    $relatorios[] = [
        "id" => $linha["id_exame"],
        "data" => date(
            "d/m/Y H:i",
            strtotime($linha["data_exame"])
        ),
        "medico" => $linha["nome_medico"],
        "paciente" => $linha["nome_paciente"],
        "cpf" => $linha["cpf_paciente"],
        "score" => calcularScoreRelatorio($linha)
    ];
}

echo json_encode([
    "status" => true,
    "relatorios" => $relatorios
]);
