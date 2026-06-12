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

$resposta = json_decode(
    file_get_contents("php://input"),
    true
);

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
        m.nome AS nome_medico,
        p.nome AS nome_paciente,
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
    $query .= "AND m.id_medico = ?";
    $tipos .= "i";
    $valores[] = $_SESSION["id_medico"];
}

if ($pesquisaPaciente !== "") {
    $query .= "AND (p.nome LIKE ? OR p.cpf_paciente LIKE ?)";
    $tipos .= "ss";
    $busca = "%" . $pesquisaPaciente . "%";
    $valores[] = $busca;
    $valores[] = $busca;
}

if ($nomeMedico !== "") {
    $query .= "AND m.nome LIKE ?";
    $tipos .= "s";
    $valores[] = "%" . $nomeMedico . "%";
}

if ($dataInicio !== "") {
    $query .= "AND DATE(e.data_exame) >= ?";
    $tipos .= "s";
    $valores[] = $dataInicio;
}

if ($dataFinal !== "") {
    $query .= "AND DATE(e.data_exame) <= ?";
    $tipos .= "s";
    $valores[] = $dataFinal;
}

$query .= "ORDER BY e.data_exame DESC";
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
        "cpf" => $linha["cpf_paciente"]
    ];
}

echo json_encode([
    "status" => true,
    "relatorios" => $relatorios
]);