
<?php

           // FLUXO GERAL
    // 1. permitir resposta JSON
    // 2. carregar conexao.php
    // 3. ler JSON enviado pelo front
    // 4. pegar nome, crm e senha
    // 5. validar se veio tudo
    // 6. inserir na tabela medico
    // 7. responder sucesso ou erro


    //1 php avisa o js que a resposta deve ser em json
    header("content-Type: application/json" );
    
    //2
    require_once("conexao.php");

    

?>