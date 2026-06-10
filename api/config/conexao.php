
<?php

//conexao com o banco, mudar a depnder do root
$host = "localhost";
$usuario = "root";
$senha = "1234";
$banco = "hospital_crmj";

$conexao = new mysqli($host, $usuario, $senha, $banco);

if ($conexao -> connect_error) {
    die("erro na conexao " . $conexao->connect_error);
}

?>