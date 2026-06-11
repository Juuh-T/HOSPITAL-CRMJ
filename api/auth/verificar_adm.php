<?php

session_start();

if (!isset($_SESSION["id_medico"])) {
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        "status" => false,
        "mensagem" => "Usuário não autenticado."
    ]);
    exit;
}

if (!isset($_SESSION["tipo"]) || $_SESSION["tipo"] !== "ADM") {
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        "status" => false,
        "mensagem" => "Acesso negado."
    ]);

    exit;
    
}

else{
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        "status" => true,
        "mensagem" => "Adm detectado."
    ]);
    exit;
}