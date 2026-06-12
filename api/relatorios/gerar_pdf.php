<?php

require_once(__DIR__ . "/../config/conexao.php");
require_once(__DIR__ . "/../lib/fpdf/fpdf.php");

$idExame = $_GET["id"] ?? 0;

$query = "
SELECT
    e.*,
    p.nome AS nome_paciente,
    p.idade,
    p.peso,
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
LEFT JOIN autorizacoes_medicas am
    ON am.paciente_id = p.id_paciente
LEFT JOIN medico m
    ON m.id_medico = am.medico_id
WHERE e.id_exame = ?
";

$stmt = $conexao->prepare($query);
$stmt->bind_param("i", $idExame);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado->num_rows === 0){
    die("Exame não encontrado.");
}

$dados = $resultado->fetch_assoc();

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