
<?php
//CHECAR SE  O MEDICO TA ATIVO AINDA

header("Content-Type: application/json; charset=utf-8 ");

session_start();

// VERIFICAR SE O MEDICO ESTA DESLOGADO DA SESSAO PHP ou seja N EXISTE SESSAO   
if ( ! isset($_SESSION["id_medico"])){
    echo json_encode
    ([
        "status" => false,  
        "mensagem" => "Faça login novamente."
    ]);
    exit;
}
    
//TESTAR SE O HORARIO DE AGORA JA PASSOU DO HORARIO MAXIMO PERMITIDO
else if ( time() > $_SESSION["expira_em"] ){
    echo json_encode
    ([
        "status" => false,
        "mensagem" => "Sessão expirou."
    ]);
    session_destroy();
    exit;
}

//SE PASSOU ENTAO ESTA LOGADO
//MEDICO LOGADO
//verifica tambem se é medico comum ou medico adm
else if ( $_SESSION["tipo"] !== "ADM"){
    echo json_encode
([
    "status" => true,
    "administrador" => false,
    "mensagem" => "Usúario sem privilégios de administrador autenticado."
]);
}
else if ( $_SESSION["tipo"] === "ADM"){
    echo json_encode
([
    "status" => true,
    "administrador" => true,
    "mensagem" => "Admin autenticado.",
    "nome" => $_SESSION["nome"]
]);
}





?>