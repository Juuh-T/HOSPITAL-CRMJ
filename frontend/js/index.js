   
function mostrarSenha() {
    let senha = document.getElementById("senha");
    let icone = document.getElementById("iconeOlho");

    if (senha.type === "password") {
        senha.type = "text";
        icone.classList.remove("bi-eye-slash");
        icone.classList.add("bi-eye");
    } else {
        senha.type = "password";
        icone.classList.remove("bi-eye");
        icone.classList.add("bi-eye-slash");
    }
}

// Funcao do login php
// sessao php dados ficam no servidor, ligados ao usuario, 
function js_fazerLogin() 
{
    let usuario = document.getElementById("usuario").value
    let senha = document.getElementById("senha").value

    if ( senha === "" || usuario === "")
    {
        alert("Digite seu login.")
        return
    }
    
    // comunicacao server pra verificar se os dados procedem
    fetch ("../backend/login.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            crm: usuario,
            senha: senha
        })
    })

    // primeiro then pega a resposta http do php 
    .then(function (respostaPhp){
        // uso a funcao json() pra ler a mensagem ja ta em json pelo php, ele transforma a sting texto num objeto
        return respostaPhp.json();
    })

    // VERIFICAO LOGIN VALIDO 
    .then(function ( dados ) {
        if ( dados.status === true ){
            window.location.href = "paciente.html";
        }
        else{
            alert(dados.mensagem)
        }
    })

    // segundo .then usa os dados


}

    