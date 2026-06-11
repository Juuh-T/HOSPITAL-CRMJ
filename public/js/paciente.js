
// reconhece a sessao pelo cookie
window.onload = js_verificarSessao;

function js_verificarSessao(){

    fetch("../api/auth/verificar_sessao.php")

    .then(function (respostaPhpSessao) 
    {
        return respostaPhpSessao.json();
    })

    .then(function (dadosSessao) 
    {
        if (dadosSessao.status === false) 
        {
            alert(dadosSessao.mensagem);
            window.location.href = "../index.html";
            return;
        }

    //se tudo estiver ok inicia a pagina
    js_iniciarPaginaPaciente();
    return;
        
    });
}

function js_sair(){
    fetch("../api/auth/logout.php")

    .then(function (respLogout){
        return respLogout.json();
    })

    .then( function ( dadosLogout ){
        if ( dadosLogout.status === true ){
            window.location.href = "../index.html"; 
        }
    })
}

function js_iniciarPaginaPaciente() {
    const listaPacientes = document.querySelector(".lista-pacientes");
    const campoPesquisa = document.getElementById("campoPesquisa");
    let pacientesCarregados = [];
    fetch("/HOSPITAL-CRMJ/api/pacientes/listar_pacientes.php")
    .then(function(resposta){
        return resposta.json();
    })
    .then(function(dados){
        pacientesCarregados = dados.pacientes;
        mostrarPacientes(pacientesCarregados);
    });

    function mostrarPacientes(lista){
        listaPacientes.innerHTML = "";
        lista.forEach(function(paciente){
            listaPacientes.innerHTML += `
                <div class="paciente"
                    data-nome="${paciente.nome}"
                    data-cpf="${paciente.cpf_paciente}">
                    <div class="paciente-info">
                        <i class="bi bi-person"></i>
                        <span>
                            ${paciente.nome}
                        </span>
                    </div>
                </div>
            `;
        });
    }

    listaPacientes.addEventListener("click", function(event){
        const paciente = event.target.closest(".paciente");
        if (!paciente) return;
        const cpfSelecionado = paciente.dataset.cpf;
        const dadosPaciente = pacientesCarregados.find(function(p){
            return p.cpf_paciente == cpfSelecionado;
        });

        document.getElementById("tituloPaciente").textContent =
            dadosPaciente.nome;
        document.getElementById("nomePaciente").value =
            dadosPaciente.nome;
        document.getElementById("cpf").value =
            dadosPaciente.cpf_paciente;
        document.getElementById("idadePaciente").value =
            dadosPaciente.idade;
        document.getElementById("pesoPaciente").value =
            dadosPaciente.peso;
            
    });


    campoPesquisa.addEventListener("input", function(){

        const pesquisa = campoPesquisa.value.toLowerCase();
        const filtrados = pacientesCarregados.filter(function(p){
            return p.nome.toLowerCase().includes(pesquisa)
                || p.cpf_paciente.includes(pesquisa);
        });
        mostrarPacientes(filtrados);

    });

}


// funcao area admin
function js_irAreaAdmin(){

    

    fetch("../api/auth/verificar_adm.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    })
        

    .then( function ( respostaPhp ){
        return respostaPhp.json();
    })

    .then( function ( dados ){
        if (dados.status === true){
            window.location.href = "profissionais.html"
        }

        else{
            alert(dados.mensagem);
        }
    })
}