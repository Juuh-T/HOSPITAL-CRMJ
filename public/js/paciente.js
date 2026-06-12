const sintomasSXF = [
    { id: "deficiencia_intelectual", pesoM: 0.32, pesoF: 0.20 },
    { id: "face_alongada_orelhas", pesoM: 0.29, pesoF: 0.09 },
    { id: "macroorquidismo", pesoM: 0.26, pesoF: 0.00 },
    { id: "hipermobilidade_articular", pesoM: 0.19, pesoF: 0.04 },
    { id: "dificuldade_aprendizagem", pesoM: 0.18, pesoF: 0.28 },
    { id: "deficit_atencao", pesoM: 0.17, pesoF: 0.12 },
    { id: "movimentos_repetitivos", pesoM: 0.17, pesoF: 0.05 },
    { id: "atraso_fala", pesoM: 0.14, pesoF: 0.01 },
    { id: "hiperatividade", pesoM: 0.12, pesoF: 0.04 },
    { id: "evita_contato_visual", pesoM: 0.06, pesoF: 0.08 },
    { id: "evita_contato_fisico", pesoM: 0.04, pesoF: 0.07 },
    { id: "agressividade", pesoM: 0.01, pesoF: 0.02 }
];

// reconhece a sessao pelo cookie
window.onload = js_verificarSessao;

function js_verificarSessao(){
    fetch("../api/auth/verificar_sessao.php")
    .then(function (respostaPhpSessao) {return respostaPhpSessao.json();})
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
    .then(function (respLogout){return respLogout.json();})
    .then( function ( dadosLogout ){
        if ( dadosLogout.status === true ){
            window.location.href = "../index.html"; 
        }
    })
}

function js_irAreaRelatorio() {
    window.location.href = "relatorio.html";
}

function js_irAreaAdmin() {
    fetch("../api/auth/verificar_adm.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
    .then(function (respostaPhp) {
        return respostaPhp.json();
    })
    .then(function (dados) {
        console.log(dados);

        if (dados.status === true) {
            window.location.href = "profissionais.html";
        } else {
            alert(dados.mensagem);
        }
    })
    .catch(function (erro) {
        console.log("Erro ao verificar admin:", erro);
        alert("Erro ao verificar permissão de administrador.");
    });
}

function js_iniciarPaginaPaciente() {
    const listaPacientes = document.querySelector(".lista-pacientes");
    const campoPesquisa = document.getElementById("campoPesquisa");
    let pacientesCarregados = [];
    fetch("/HOSPITAL-CRMJ/api/pacientes/listar_pacientes.php")
    .then(function(resposta){return resposta.json();})
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

        document.getElementById("tituloPaciente").textContent = dadosPaciente.nome;
        document.getElementById("nomePaciente").value = dadosPaciente.nome;
        document.getElementById("cpf").value = dadosPaciente.cpf_paciente;
        document.getElementById("idadePaciente").value = dadosPaciente.idade;
        document.getElementById("pesoPaciente").value = dadosPaciente.peso;
        document.getElementById("sexoPaciente").value = dadosPaciente.sexo;

        document.getElementById("nomeAcompanhante").value = dadosPaciente.acompanhante.nome;
        document.getElementById("cpfAcompanhante").value = dadosPaciente.acompanhante.cpf;
        document.getElementById("telefoneAcompanhante").value = dadosPaciente.acompanhante.telefone;

        let checklistTexto = "";
            if (dadosPaciente.checklist.deficiencia_intelectual == 1)
                checklistTexto += "✓ Deficiência intelectual\n";
            if (dadosPaciente.checklist.face_alongada_orelhas == 1)
                checklistTexto += "✓ Face alongada e orelhas\n";
            if (dadosPaciente.checklist.macroorquidismo == 1)
                checklistTexto += "✓ Macroorquidismo\n";
            if (dadosPaciente.checklist.hipermobilidade_articular == 1)
                checklistTexto += "✓ Hipermobilidade articular\n";
            if (dadosPaciente.checklist.dificuldade_aprendizagem == 1)
                checklistTexto += "✓ Dificuldade de aprendizagem\n";
            if (dadosPaciente.checklist.deficit_atencao == 1)
                checklistTexto += "✓ Déficit de atenção\n";
            if (dadosPaciente.checklist.movimentos_repetitivos == 1)
                checklistTexto += "✓ Movimentos repetitivos\n";
            if (dadosPaciente.checklist.atraso_fala == 1)
                checklistTexto += "✓ Atraso na fala\n";
            if (dadosPaciente.checklist.hiperatividade == 1)
                checklistTexto += "✓ Hiperatividade\n";
            if (dadosPaciente.checklist.evita_contato_visual == 1)
                checklistTexto += "✓ Evita contato visual\n";
            if (dadosPaciente.checklist.evita_contato_fisico == 1)
                checklistTexto += "✓ Evita contato físico\n";
            if (dadosPaciente.checklist.agressividade == 1)
                checklistTexto += "✓ Agressividade\n";
            document.getElementById("checklistPaciente").value = checklistTexto;
            document.getElementById("fotoPaciente").src = dadosPaciente.foto;

            const resultado = calcularScore(dadosPaciente.checklist, dadosPaciente.sexo);
            const resultadoScore = document.getElementById("resultadoScore");
            if (resultado.altoRisco) {
                resultadoScore.innerHTML = `
                    <h3>ALTO RISCO</h3>
                    <p>Score: ${resultado.score}</p>
                    <p>
                        Recomendado encaminhamento para teste genético
                        confirmatório.
                    </p>
                `;
            }
            else {
                resultadoScore.innerHTML = `
                    <h3>BAIXO RISCO</h3>
                    <p>Score: ${resultado.score}</p>
                    <p>
                        Paciente não atinge os critérios clínicos de corte atuais
                        para a SXF.
                    </p>
                `;
            }
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

function calcularScore(checklist, sexo) {
    let scoreTotal = 0;
    sintomasSXF.forEach(function (sintoma) {
        if (Number(checklist[sintoma.id]) === 1) {
            if (sexo === "Masculino") {
                scoreTotal += sintoma.pesoM;
            }
            else {
                scoreTotal += sintoma.pesoF;
            }
        }
    });
    scoreTotal = Number(scoreTotal.toFixed(2));
    const limite = (sexo === "Masculino") ? 0.56 : 0.55;
    return {
        score: scoreTotal,
        altoRisco: scoreTotal >= limite
    };
}


