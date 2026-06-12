document.addEventListener("DOMContentLoaded", js_gerarRelatorio);

function js_gerarRelatorio() {

    const pesquisaPaciente = document.getElementById("pesquisaPaciente").value;
    const nomeMedico = document.getElementById("nomeMedico").value;

    // início
    const diaInicio = document.getElementById("diaInicio").value;
    const mesInicio = document.getElementById("mesInicio").value;
    const anoInicio = document.getElementById("anoInicio").value;

    // fim
    const diaFinal = document.getElementById("diaFinal").value;
    const mesFinal = document.getElementById("mesFinal").value;
    const anoFinal = document.getElementById("anoFinal").value;

    const algumaDataInicio =
        diaInicio !== "" ||
        mesInicio !== "" ||
        anoInicio !== "";

    const dataInicioCompleta =
        diaInicio !== "" &&
        mesInicio !== "" &&
        anoInicio !== "";

    const algumaDataFinal =
        diaFinal !== "" ||
        mesFinal !== "" ||
        anoFinal !== "";

    const dataFinalCompleta =
        diaFinal !== "" &&
        mesFinal !== "" &&
        anoFinal !== "";

    if (algumaDataInicio && !dataInicioCompleta) {
        alert("Preencha dia, mês e ano da data inicial.");
        return;
    }

    if (algumaDataFinal && !dataFinalCompleta) {
        alert("Preencha dia, mês e ano da data final.");
        return;
    }

    fetch("../api/relatorios/listar_relatorios.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            pesquisaPaciente: pesquisaPaciente,
            nomeMedico: nomeMedico,

            diaInicio: diaInicio,
            mesInicio: mesInicio,
            anoInicio: anoInicio,

            diaFinal: diaFinal,
            mesFinal: mesFinal,
            anoFinal: anoFinal
        })
    })

    .then(function (respostaPhp) {
        return respostaPhp.json();
    })
    .then(function (dados) {
        if (dados.status === false) {
            alert(dados.mensagem);
            return;
        }
        const tabelaResultados =
            document.querySelector(".tabela-resultados");
        tabelaResultados.innerHTML = `
            <div class="cabecalho-tabela">
                <span>Data</span>
                <span>Médico</span>
                <span>Paciente</span>
                <span>CPF do paciente</span>
                <span>Score</span>
                <span>PDF</span>
            </div>
        `;

        if (dados.relatorios.length === 0) {
            tabelaResultados.innerHTML += `
                <div class="linha-resultado">
                    <span>Nenhum resultado encontrado.</span>
                </div>
            `;
            return;
        }

        dados.relatorios.forEach(function (relatorio) {
            tabelaResultados.innerHTML += `
                <div class="linha-resultado">
                    <span>${relatorio.data}</span>
                    <span>${relatorio.medico}</span>
                    <span>${relatorio.paciente}</span>
                    <span>${relatorio.cpf}</span>
                    <span>${relatorio.score}</span>
                    <button
                        type="button"
                        class="btn-download"
                        onclick="js_downloadPaciente(${relatorio.id})">

                        <i class="bi bi-download"></i>

                    </button>
                </div>
            `;
        });
    })
    .catch(function (erro) {
        console.error(erro);
        alert("Erro ao gerar relatório.");
    });
}

function js_downloadPaciente(idExame) {
    if (!idExame) {
        alert("ID do exame não encontrado.");
        return;
    }
    window.open(
        `../api/relatorios/gerar_pdf.php?id=${idExame}`,
        "_blank"
    );

}
