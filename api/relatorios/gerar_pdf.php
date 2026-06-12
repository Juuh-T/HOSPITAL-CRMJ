<?php

session_start();

require_once(__DIR__ . "/../config/conexao.php");
require_once(__DIR__ . "/../lib/fpdf/fpdf.php");

if (!isset($_SESSION["id_medico"])) {
    die("Sessao invalida.");
}

function calcularScoreRelatorioPdf($dados) {
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
    $masculino = ($dados["sexo"] ?? "") === "Masculino";

    foreach ($sintomas as $sintoma) {
        if ((int)$dados[$sintoma[0]] === 1) {
            $score += $masculino ? $sintoma[1] : $sintoma[2];
        }
    }

    return number_format($score, 2, ".", "");
}

$idExame = $_GET["id"] ?? 0;

$query = "
SELECT
    e.*,
    p.nome AS nome_paciente,
    p.idade,
    p.peso,
    p.sexo,
    p.cpf_paciente,

    m.nome AS nome_medico,
    m.crm,

    a.nome AS nome_acompanhante,
    a.cpf_acompanhante,
    a.telefone

FROM examen e
INNER JOIN paciente p
    ON p.id_paciente = e.paciente_id
LEFT JOIN acompanhante a
    ON a.paciente_id = p.id_paciente
INNER JOIN autorizacoes_medicas am
    ON am.paciente_id = p.id_paciente
INNER JOIN medico m
    ON m.id_medico = am.medico_id
WHERE e.id_exame = ?
";

$tipos = "i";
$valores = [$idExame];

if ($_SESSION["tipo"] !== "ADM") {
    $query .= " AND am.medico_id = ?";
    $tipos .= "i";
    $valores[] = $_SESSION["id_medico"];
}

$stmt = $conexao->prepare($query);
$stmt->bind_param($tipos, ...$valores);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows === 0){
    die("Exame não encontrado.");
}

$dados = $resultado->fetch_assoc();
$score = calcularScoreRelatorioPdf($dados);

$pdf = new FPDF();
$pdf->AddPage();

$pdf->SetTitle("Relatorio Clinico");

$pdf->SetFont('Arial','B',18);
$pdf->Cell(0,12,utf8_decode('HOSPITAL CRMJ'),0,1,'C');

$pdf->SetFont('Arial','',12);
$pdf->Cell(0,8,utf8_decode('Relatório Clínico de Triagem'),0,1,'C');

$pdf->Ln(8);

$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,'Paciente',0,1);

$pdf->SetFont('Arial','',11);

$pdf->Cell(0,8,
    utf8_decode("Nome: " . $dados['nome_paciente']),
    0,1);

$pdf->Cell(0,8,
    "CPF: " . $dados['cpf_paciente'],
    0,1);

$pdf->Cell(0,8,
    utf8_decode("Idade: " . $dados['idade'] . " anos"),
    0,1);

$pdf->Cell(0,8,
    utf8_decode("Peso: " . $dados['peso'] . " kg"),
    0,1);

$pdf->Cell(0,8,
    utf8_decode("Sexo: " . $dados['sexo']),
    0,1);

$pdf->Ln(5);

$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,utf8_decode('Médico Responsável'),0,1);

$pdf->SetFont('Arial','',11);

$pdf->Cell(
    0,
    8,
    utf8_decode("Nome: " . $dados['nome_medico']),
    0,
    1
);

$pdf->Cell(
    0,
    8,
    "CRM: " . $dados['crm'],
    0,
    1
);

$pdf->Ln(5);

$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,'Acompanhante',0,1);

$pdf->SetFont('Arial','',11);

if (!empty($dados['nome_acompanhante'])){

    $pdf->Cell(
        0,
        8,
        utf8_decode("Nome: " . $dados['nome_acompanhante']),
        0,
        1
    );

    $pdf->Cell(
        0,
        8,
        "CPF: " . $dados['cpf_acompanhante'],
        0,
        1
    );

    $pdf->Cell(
        0,
        8,
        utf8_decode("Telefone: " . $dados['telefone']),
        0,
        1
    );

}else{

    $pdf->Cell(
        0,
        8,
        utf8_decode("Nenhum acompanhante cadastrado."),
        0,
        1
    );
}

$pdf->Ln(5);

$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,'Exame',0,1);

$pdf->SetFont('Arial','',11);

$pdf->Cell(
    0,
    8,
    utf8_decode("Data: " . $dados['data_exame']),
    0,
    1
);

$pdf->Cell(
    0,
    8,
    utf8_decode(
        "Resultado: " .
        ($dados['resultado'] ? "POSITIVO" : "NEGATIVO")
    ),
    0,
    1
);

$pdf->Cell(
    0,
    8,
    utf8_decode("Score: " . $score),
    0,
    1
);

$pdf->Ln(5);
$pdf->SetFont('Arial','B',14);
$pdf->Cell(0,10,utf8_decode('Checklist Clínico'),0,1);

$pdf->SetFont('Arial','',11);

function marcar($valor){
    return $valor ? "[X]" : "[ ]";
}

$itens = [
    "Deficiencia Intelectual" => $dados['sintoma_deficiencia_intelectual'],
    "Face Alongada e Orelhas Grandes" => $dados['sintoma_face_alongada_orelhas'],
    "Macroorquidismo" => $dados['sintoma_macroorquidismo'],
    "Hipermobilidade Articular" => $dados['sintoma_hipermobilidade_articular'],
    "Dificuldade de Aprendizagem" => $dados['sintoma_dificuldade_aprendizagem'],
    "Deficit de Atencao" => $dados['sintoma_deficit_atencao'],
    "Movimentos Repetitivos" => $dados['sintoma_movimentos_repetitivos'],
    "Atraso na Fala" => $dados['sintoma_atraso_fala'],
    "Hiperatividade" => $dados['sintoma_hiperatividade'],
    "Evita Contato Visual" => $dados['sintoma_evita_contato_visual'],
    "Evita Contato Fisico" => $dados['sintoma_evita_contato_fisico'],
    "Agressividade" => $dados['sintoma_agressividade']
];

foreach($itens as $nome => $valor){

    $pdf->Cell(
        0,
        8,
        marcar($valor) . " " . utf8_decode($nome),
        0,
        1
    );
}

$pdf->Ln(10);

$pdf->Cell(0,10,'',0,1);

$pdf->Cell(
    80,
    0,
    '',
    'T'
);

$pdf->Ln(5);

$pdf->Cell(
    80,
    8,
    utf8_decode($dados['nome_medico']),
    0,
    1,
    'C'
);

$pdf->Cell(
    80,
    8,
    "CRM: ".$dados['crm'],
    0,
    1,
    'C'
);

$pdf->Output(
    'D',
    'relatorio_'.$dados['nome_paciente'].'.pdf'
);
