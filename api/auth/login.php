
<?php

    //1. dizer que a resposta será JSON
    header("Content-type: application/json; charset=utf-8");

    //2. incluir a conexão com o banco
    require_once("conexao.php");

    //3. ler os dados que vieram do JavaScript
    $resposta = json_decode(file_get_contents("php://input"), true);

    $crm = $resposta["crm"] ?? "";
    $senha = $resposta["senha"] ??""; //?? diz que se existir otimo, se n usa o vazio

    //4. validar se CRM/senha vieram vazios
    if ($crm == "" || $senha == "") { 
        echo json_encode([
            "status" => false,
            "mensagem" => "Crm e senha obrigatórios."
        ]);
        exit;
    }

    $query = "SELECT id_medico, nome, crm, tipo, status_medico FROM medico WHERE crm = ? AND senha = ?";
    $stmt = $conexao->prepare($query);
    $stmt->bind_param("ss", $crm, $senha);

    $stmt->execute();
    $resultado = $stmt->get_result();

    //VERIFICAO SE DEU MATCH NO BANCO
    if ( $resultado -> num_rows === 1){

        //pega a linha do medico e bota numa listinha php
        $medico = $resultado->fetch_assoc();

        //aqui ele verifica se o medico ta desativado, se sim, ele não deixa logar
        if ($medico["status"] == "DESATIVADO") {
            echo json_encode([
                "status" => false,
                "mensagem" => "Médico desativado."
            ]);
            exit;
        }
        //verifica se o medico ta de ferias
        if ($medico["status"] == "FERIAS") {
            echo json_encode([
                "status" => false,
                "mensagem" => "Médico em férias."
            ]);
            exit;
        }


        // INICAR SESSAO SERVIDOR PHP //
        //inicia sessao no servidor php pra guardar as informacoes do medico
        session_start();
        $_SESSION["nome"] = $medico["nome"];
        $_SESSION["id_medico"] = $medico["id_medico"];
        $_SESSION["crm"] = $medico["crm"];
        $_SESSION["tipo"] = $medico["tipo"];
        $_SESSION["expira_em"] = time() + 86400; //pego daqui 24 horas pra saber quando encerrar a sessao dele

        echo json_encode([
            "status" => true,
            "mensagem" => "bem vindo doutor(a).",

            //passa pro js as informacoes do medico, dados apenas pra mostrar algo na tela, n é necessario
            "medico" => [
                "id" => $medico["id_medico"],
                "nome" => $medico["nome"],
                "crm" => $medico["crm"],
                "tipo" => $medico["tipo"]
            ]
        ]);
        exit;
    }

    else{
        echo json_encode([
            "status" => false,
            "mensagem" => "Medico não encontrado."
        ]);
        exit;
    }


    
?>