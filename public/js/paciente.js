
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
            window.location.href = "index.html";
        }

    //se tudo estiver ok inicia a pagina
    js_iniciarPaginaPaciente();
        
    });
}

function js_sair(){
    fetch("../api/auth/logout.php")

    .then(function (respLogout){
        return respLogout.json();
    })

    .then( function ( dadosLogout ){
        if ( dadosLogout.status === true ){
            window.location.href = "index.html"; 
        }
    })
}


    


document.addEventListener("DOMContentLoaded", function js_iniciarPaginaPaciente () {
    const botaoAdicionar = document.querySelector(".btn-add");
    const listaPacientes = document.querySelector(".lista-pacientes");
    const tituloPaciente = document.querySelector("#tituloPaciente");
    const camposDados = document.querySelectorAll(".campo-dado");
    const checklist = document.querySelector(".checklist");
    const campoPesquisa = document.querySelector(".barra-pesquisa input");

    const cpf = document.getElementById("cpf");
    const telefone = document.getElementById("telefone");
    const nascimento = document.getElementById("nascimento");

    let pacienteSelecionado = document.querySelector(".paciente");
    let nomeEscondido = false;

    function atualizarTextoPaciente(paciente, texto) {
        paciente.innerHTML = `
            <div class="paciente-info">
                <i class="bi bi-person"></i>
                <span class="nome-paciente-lista">${texto}</span>
            </div>

            <span class="excluir-paciente">&#128465;</span>
        `;
    }

    function prepararPacientesIniciais() {
        const pacientes = document.querySelectorAll(".paciente");

        pacientes.forEach(function (paciente) {
            const nomeElemento = paciente.querySelector(".paciente-info span");
            const texto = nomeElemento.textContent.trim();

            const numeroEncontrado = texto.match(/Paciente\s*(\d+)/);

            if (numeroEncontrado) {
                paciente.dataset.numero = numeroEncontrado[1];
                paciente.dataset.nomePadrao = texto;
                paciente.dataset.nome = texto;
            }

            atualizarTextoPaciente(paciente, texto);
        });
    }

    function pegarProximoNumeroPaciente() {
        const pacientes = document.querySelectorAll(".paciente");
        let maiorNumero = 0;

        pacientes.forEach(function (paciente) {
            const numero = Number(paciente.dataset.numero);

            if (numero > maiorNumero) {
                maiorNumero = numero;
            }
        });

        return maiorNumero + 1;
    }

    function selecionarPaciente(paciente) {
        const todosPacientes = document.querySelectorAll(".paciente");

        todosPacientes.forEach(function (item) {
            item.classList.remove("ativo");
        });

        paciente.classList.add("ativo");
        pacienteSelecionado = paciente;

        if (nomeEscondido) {
            tituloPaciente.textContent = "••••••••";
            tituloPaciente.contentEditable = "false";
        } else {
            tituloPaciente.textContent = paciente.dataset.nome;
            tituloPaciente.contentEditable = "true";
        }
    }

    function excluirPaciente(paciente) {
        const eraSelecionado = paciente === pacienteSelecionado;

        paciente.remove();

        if (eraSelecionado) {
            const primeiroPaciente = document.querySelector(".paciente");

            if (primeiroPaciente) {
                selecionarPaciente(primeiroPaciente);
            } else {
                pacienteSelecionado = null;
                tituloPaciente.textContent = "Nenhum paciente";

                camposDados.forEach(function (campo) {
                    campo.value = "";
                });

                checklist.value = "";
            }
        }

        filtrarPacientes();
    }

    function filtrarPacientes() {
        const textoPesquisa = campoPesquisa.value.toLowerCase().trim();
        const pacientes = document.querySelectorAll(".paciente");

        pacientes.forEach(function (paciente) {
            const nomePaciente = paciente.dataset.nome.toLowerCase();

            if (nomePaciente.includes(textoPesquisa)) {
                paciente.style.display = "flex";
            } else {
                paciente.style.display = "none";
            }
        });
    }

    botaoAdicionar.addEventListener("click", function () {
        const novoNumero = pegarProximoNumeroPaciente();
        const nomePadrao = "Paciente " + novoNumero;

        const novoPaciente = document.createElement("div");
        novoPaciente.classList.add("paciente");

        novoPaciente.dataset.numero = novoNumero;
        novoPaciente.dataset.nomePadrao = nomePadrao;
        novoPaciente.dataset.nome = nomePadrao;

        atualizarTextoPaciente(novoPaciente, nomePadrao);

        listaPacientes.appendChild(novoPaciente);

        filtrarPacientes();
        selecionarPaciente(novoPaciente);
    });

    listaPacientes.addEventListener("click", function (event) {
        const botaoExcluir = event.target.closest(".excluir-paciente");

        if (botaoExcluir) {
            const pacienteParaExcluir = botaoExcluir.closest(".paciente");
            excluirPaciente(pacienteParaExcluir);
            return;
        }

        const pacienteClicado = event.target.closest(".paciente");

        if (pacienteClicado) {
            selecionarPaciente(pacienteClicado);
        }
    });

    tituloPaciente.addEventListener("input", function () {
        if (pacienteSelecionado && nomeEscondido === false) {
            const novoNome = tituloPaciente.textContent.trim();

            pacienteSelecionado.dataset.nome = novoNome;
            atualizarTextoPaciente(pacienteSelecionado, novoNome);

            filtrarPacientes();
        }
    });

    tituloPaciente.addEventListener("blur", function () {
        if (pacienteSelecionado && tituloPaciente.textContent.trim() === "") {
            const nomePadrao = pacienteSelecionado.dataset.nomePadrao;

            pacienteSelecionado.dataset.nome = nomePadrao;
            tituloPaciente.textContent = nomePadrao;
            atualizarTextoPaciente(pacienteSelecionado, nomePadrao);

            filtrarPacientes();
        }
    });

    campoPesquisa.addEventListener("input", function () {
        filtrarPacientes();
    });

    function deixarSoNumeros(valor) {
        return valor.replace(/\D/g, "");
    }

    cpf.addEventListener("input", function () {
        let valor = deixarSoNumeros(cpf.value);

        valor = valor.slice(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        cpf.value = valor;
    });

    telefone.addEventListener("input", function () {
        let valor = telefone.value;

        valor = valor.replace(/\D/g, "");
        valor = valor.slice(0, 13);

        if (valor.length === 0) {
            telefone.value = "";
            return;
        }

        if (valor.length <= 2) {
            valor = "+" + valor;
        } else if (valor.length <= 4) {
            valor = valor.replace(/(\d{2})(\d)/, "+$1 ($2");
        } else if (valor.length <= 9) {
            valor = valor.replace(/(\d{2})(\d{2})(\d)/, "+$1 ($2) $3");
        } else {
            valor = valor.replace(/(\d{2})(\d{2})(\d{5})(\d)/, "+$1 ($2) $3-$4");
        }

        telefone.value = valor;
    });

    nascimento.addEventListener("input", function () {
        let valor = deixarSoNumeros(nascimento.value);

        valor = valor.slice(0, 8);

        valor = valor.replace(/(\d{2})(\d)/, "$1/$2");
        valor = valor.replace(/(\d{2})(\d)/, "$1/$2");

        nascimento.value = valor;
    });

    window.mudarOlho = function () {
        const iconeOlho = document.getElementById("iconeOlho");

        if (nomeEscondido === false) {
            nomeEscondido = true;

            tituloPaciente.textContent = "••••••••";
            tituloPaciente.contentEditable = "false";

            iconeOlho.classList.remove("bi-eye");
            iconeOlho.classList.add("bi-eye-slash");
        } else {
            nomeEscondido = false;

            if (pacienteSelecionado) {
                tituloPaciente.textContent = pacienteSelecionado.dataset.nome;
            }

            tituloPaciente.contentEditable = "true";

            iconeOlho.classList.remove("bi-eye-slash");
            iconeOlho.classList.add("bi-eye");
        }
    };

    window.abrirSexo = function () {
        const opcoes = document.getElementById("opcoesSexo");

        if (opcoes.style.display === "block") {
            opcoes.style.display = "none";
        } else {
            opcoes.style.display = "block";
        }
    };

    window.selecionarSexo = function (valor) {
        const escolhido = document.querySelector(".select-escolhido");
        const opcoes = document.getElementById("opcoesSexo");

        escolhido.textContent = valor;
        opcoes.style.display = "none";
    };

    prepararPacientesIniciais();
    selecionarPaciente(pacienteSelecionado);
});


