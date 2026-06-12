
<?php

           // FLUXO GERAL //
    //1. responder JSON
    //2. iniciar sessão
    //3. verificar se tem médico logado
    //4. verificar se a sessão não expirou
    //5. verificar se $_SESSION["tipo"] é "admin"
    //6. só depois ler os dados do novo médico
    //7. validar campos
    //8. inserir no banco


    //1 php avisa o js que a resposta deve ser em json
header("content-Type: application/json" );

//2
require_once(__DIR__ . "/../config/conexao.php");

session_start();

if ( ! isset ($_SESSION["id_medico"])){
        echo json_encode
        ([
        "status" => false,
        "mensagem" => "Medico não logado."
    ]);
    exit;
}

else if ( time() > $_SESSION["expira_em"] ){
echo json_encode
([
    "status" => false,
    "mensagem" => "Sessão expirou."
]);
session_destroy();
exit;
}

if ( $_SESSION["tipo"] !== "ADM"){
    echo json_encode
([
    "status" => false,
    "mensagem" => "Sem acesso, beta."
]);
exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$nome = $dados["nome"] ?? "";
$crm = $dados["crm"] ?? "";
$senha = $dados["senha"] ?? "";
$data_aceite_termos = $dados["data_aceite_termos"] ?? "";
$termos_aceitos = 1;

//4
if ( $nome === "" || $crm === "" || $data_aceite_termos === "" || $senha === ""
 ){
    echo json_encode([
        "status" => false,
        "mensagem" => "Preencha todos os campos corretamente."
    ]);
    exit;

}

//botar no banco
$query = "INSERT INTO medico (nome, crm, senha, termos_aceitos, data_aceite_termos) VALUES (?,?,?,?,?)";
$stmt = $conexao->prepare($query);
$stmt->bind_param("sssis", $nome, $crm, $senha, $termos_aceitos, $data_aceite_termos );
$deuCerto = $stmt->execute();

if ( $deuCerto === false ){
    echo json_encode([
        "status" => false,
        "mensagem" => "Não foi possível cadastrar. Verifique se o CRM já existe."
    ]);
    exit;
}
    
echo json_encode([
        "status" => true,
        "mensagem" => "sucesso."
    ]);
    exit;

?>
