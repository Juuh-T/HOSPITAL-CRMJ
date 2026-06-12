<?php

header("Content-Type: application/json; charset=utf-8");

require_once(__DIR__ . "/../config/conexao.php");

$testes = [];

// Teste 1: ver pacientes
$sqlPacientes = "SELECT * FROM paciente";
$resultadoPacientes = $conexao->query($sqlPacientes);

$testes["paciente"] = [
    "quantidade" => $resultadoPacientes ? $resultadoPacientes->num_rows : 0,
    "erro" => $conexao->error,
    "dados" => []
];

if ($resultadoPacientes) {
    while ($linha = $resultadoPacientes->fetch_assoc()) {
        $testes["paciente"]["dados"][] = $linha;
    }
}

// Teste 2: ver autorizações médicas
$sqlAutorizacoes = "SELECT * FROM autorizacoes_medicas";
$resultadoAutorizacoes = $conexao->query($sqlAutorizacoes);

$testes["autorizacoes_medicas"] = [
    "quantidade" => $resultadoAutorizacoes ? $resultadoAutorizacoes->num_rows : 0,
    "erro" => $conexao->error,
    "dados" => []
];

if ($resultadoAutorizacoes) {
    while ($linha = $resultadoAutorizacoes->fetch_assoc()) {
        $testes["autorizacoes_medicas"]["dados"][] = $linha;
    }
}

// Teste 3: ver médicos
$sqlMedicos = "SELECT * FROM medico";
$resultadoMedicos = $conexao->query($sqlMedicos);

$testes["medico"] = [
    "quantidade" => $resultadoMedicos ? $resultadoMedicos->num_rows : 0,
    "erro" => $conexao->error,
    "dados" => []
];

if ($resultadoMedicos) {
    while ($linha = $resultadoMedicos->fetch_assoc()) {
        $testes["medico"]["dados"][] = $linha;
    }
}

echo json_encode($testes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);