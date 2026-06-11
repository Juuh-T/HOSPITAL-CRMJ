<?php
session_start();
header("Content-Type: application/json; charset=utf-8");

// Ajuste o caminho do conexao.php conforme a organização das suas pastas
require_once("conexao.php");

// Verifica se o médico está logado (usando a mesma lógica do seu listar_pacientes.php)
// Se no momento de teste vocês não estiverem usando login, pode comentar essas linhas
if (!isset($_SESSION["id_medico"])) {
    echo json_encode(["status" => false, "mensagem" => "Erro: Médico não autenticado. Faça login."]);
    exit;
}
$id_medico = $_SESSION["id_medico"];

try {
    // Inicia uma transação: se der erro em uma tabela, ele cancela tudo para não sujar o banco
    $conexao->begin_transaction();

    $nome_paciente = $_POST['nome_paciente'];
    $idade = $_POST['idade'];
    $peso = $_POST['peso'];
    $cpf_paciente = $_POST['cpf_paciente'];
    $sexo = $_POST['sexo']; // Precisamos do sexo para o cálculo de risco

    $stmt_paciente = $conexao->prepare("INSERT INTO paciente (nome, idade, peso, cpf_paciente) VALUES (?, ?, ?, ?)");
    $stmt_paciente->bind_param("sids", $nome_paciente, $idade, $peso, $cpf_paciente);
    $stmt_paciente->execute();
    $paciente_id = $conexao->insert_id; // Pega o ID gerado automaticamente

    $nome_acompanhante = $_POST['nome_acompanhante'];
    $cpf_acompanhante = $_POST['cpf_acompanhante'];
    $telefone_acompanhante = $_POST['telefone_acompanhante'];

    $stmt_acomp = $conexao->prepare("INSERT INTO acompanhante (paciente_id, nome, cpf_acompanhante, telefone) VALUES (?, ?, ?, ?)");
    $stmt_acomp->bind_param("isss", $paciente_id, $nome_acompanhante, $cpf_acompanhante, $telefone_acompanhante);
    $stmt_acomp->execute();

    $caminhos_fotos = [null, null, null, null];
    $diretorio_uploads = __DIR__ . '/uploads/'; // Pasta onde as fotos ficarão salvas

    // Cria a pasta se ela não existir
    if (!is_dir($diretorio_uploads)) {
        mkdir($diretorio_uploads, 0777, true);
    }

    if (isset($_FILES['fotos_paciente'])) {
        for ($i = 0; $i < count($_FILES['fotos_paciente']['name']); $i++) {
            if ($_FILES['fotos_paciente']['error'][$i] === UPLOAD_ERR_OK && $i < 4) {
                $extensao = pathinfo($_FILES['fotos_paciente']['name'][$i], PATHINFO_EXTENSION);
                // Gera um nome único para não substituir fotos com o mesmo nome
                $nome_arquivo = "paciente_{$paciente_id}_foto_{$i}_" . time() . ".{$extensao}";
                $caminho_completo = $diretorio_uploads . $nome_arquivo;
                
                if (move_uploaded_file($_FILES['fotos_paciente']['tmp_name'][$i], $caminho_completo)) {
                    $caminhos_fotos[$i] = "uploads/" . $nome_arquivo; // Caminho salvo no banco
                }
            }
        }
    }

    // Pegamos os valores de $_POST, se não existir assume 0 (Não)
    $s1 = isset($_POST['sintoma_deficiencia_intelectual']) ? (int)$_POST['sintoma_deficiencia_intelectual'] : 0;
    $s2 = isset($_POST['sintoma_face_alongada_orelhas']) ? (int)$_POST['sintoma_face_alongada_orelhas'] : 0;
    $s3 = isset($_POST['sintoma_macroorquidismo']) ? (int)$_POST['sintoma_macroorquidismo'] : 0;
    $s4 = isset($_POST['sintoma_hipermobilidade_articular']) ? (int)$_POST['sintoma_hipermobilidade_articular'] : 0;
    $s5 = isset($_POST['sintoma_dificuldade_aprendizagem']) ? (int)$_POST['sintoma_dificuldade_aprendizagem'] : 0;
    $s6 = isset($_POST['sintoma_deficit_atencao']) ? (int)$_POST['sintoma_deficit_atencao'] : 0;
    $s7 = isset($_POST['sintoma_movimentos_repetitivos']) ? (int)$_POST['sintoma_movimentos_repetitivos'] : 0;
    $s8 = isset($_POST['sintoma_atraso_fala']) ? (int)$_POST['sintoma_atraso_fala'] : 0;
    $s9 = isset($_POST['sintoma_hiperatividade']) ? (int)$_POST['sintoma_hiperatividade'] : 0;
    $s10 = isset($_POST['sintoma_evita_contato_visual']) ? (int)$_POST['sintoma_evita_contato_visual'] : 0;
    $s11 = isset($_POST['sintoma_evita_contato_fisico']) ? (int)$_POST['sintoma_evita_contato_fisico'] : 0;
    $s12 = isset($_POST['sintoma_agressividade']) ? (int)$_POST['sintoma_agressividade'] : 0;

    // Cálculo refeito no Back-end para garantir precisão
    $score = 0;
    if ($sexo === 'Masculino') {
        $score = ($s1*0.32) + ($s2*0.29) + ($s3*0.26) + ($s4*0.19) + ($s5*0.18) + ($s6*0.17) + ($s7*0.17) + ($s8*0.14) + ($s9*0.12) + ($s10*0.06) + ($s11*0.04) + ($s12*0.01);
        $resultado_final = ($score >= 0.56) ? 1 : 0; // 1 = Alto Risco, 0 = Baixo Risco
    } else {
        // Zera macroorquidismo para mulheres por segurança
        $s3 = 0; 
        $score = ($s1*0.20) + ($s2*0.09) + ($s4*0.04) + ($s5*0.28) + ($s6*0.12) + ($s7*0.05) + ($s8*0.01) + ($s9*0.04) + ($s10*0.08) + ($s11*0.07) + ($s12*0.02);
        $resultado_final = ($score >= 0.55) ? 1 : 0;
    }

    $query_exame = "INSERT INTO examen (
        paciente_id, resultado, 
        sintoma_deficiencia_intelectual, sintoma_face_alongada_orelhas, sintoma_macroorquidismo, 
        sintoma_hipermobilidade_articular, sintoma_dificuldade_aprendizagem, sintoma_deficit_atencao, 
        sintoma_movimentos_repetitivos, sintoma_atraso_fala, sintoma_hiperatividade, 
        sintoma_evita_contato_visual, sintoma_evita_contato_fisico, sintoma_agressividade,
        foto_paciente_1, foto_paciente_2, foto_paciente_3, foto_paciente_4
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt_exame = $conexao->prepare($query_exame);
    $stmt_exame->bind_param("iiiiiiiiiiiiiissss", 
        $paciente_id, $resultado_final,
        $s1, $s2, $s3, $s4, $s5, $s6, $s7, $s8, $s9, $s10, $s11, $s12,
        $caminhos_fotos[0], $caminhos_fotos[1], $caminhos_fotos[2], $caminhos_fotos[3]
    );
    $stmt_exame->execute();

    // O médico que cadastrou já ganha a autorização validada (1) para esse paciente
    $stmt_auth = $conexao->prepare("INSERT INTO autorizacoes_medicas (medico_id, paciente_id, validado) VALUES (?, ?, 1)");
    $stmt_auth->bind_param("ii", $id_medico, $paciente_id);
    $stmt_auth->execute();

    // Confirma todas as operações no banco!
    $conexao->commit();

    echo json_encode(["status" => true, "mensagem" => "Cadastro e triagem salvos com sucesso!", "score" => $score]);

} catch (Exception $e) {
    // Se der qualquer erro no caminho, ele desfaz as inserções anteriores
    $conexao->rollback();
    echo json_encode(["status" => false, "mensagem" => "Erro ao salvar no banco de dados: " . $e->getMessage()]);
}
?>