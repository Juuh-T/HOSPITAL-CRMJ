const nomePaciente = document.getElementById("nome_paciente");
const idadePaciente = document.getElementById("idade");
const pesoPaciente = document.getElementById("peso");
const cpfPaciente = document.getElementById("cpf_paciente");

const nomeAcompanhante = document.getElementById("nome_acompanhante");
const cpfAcompanhante = document.getElementById("cpf_acompanhante");
const telefoneAcompanhante = document.getElementById("telefone_acompanhante");

let fotosPaciente = {
    frente: "",
    direita: "",
    esquerda: ""
};

const sintomasSXF = [
    { id: "sintoma_deficiencia_intelectual", label: "Deficiência Intelectual", pesoM: 0.32, pesoF: 0.20 },
    { id: "sintoma_face_alongada_orelhas", label: "Face Alongada / Orelhas de Abano", pesoM: 0.29, pesoF: 0.09 },
    { id: "sintoma_macroorquidismo", label: "Macroorquidismo", pesoM: 0.26, pesoF: 0.00 },
    { id: "sintoma_hipermobilidade_articular", label: "Hipermobilidade Articular", pesoM: 0.19, pesoF: 0.04 },
    { id: "sintoma_dificuldade_aprendizagem", label: "Dificuldades de Aprendizagem", pesoM: 0.18, pesoF: 0.28 },
    { id: "sintoma_deficit_atencao", label: "Déficit de Atenção", pesoM: 0.17, pesoF: 0.12 },
    { id: "sintoma_movimentos_repetitivos", label: "Movimentos Repetitivos / Estereotipias", pesoM: 0.17, pesoF: 0.05 },
    { id: "sintoma_atraso_fala", label: "Atraso na Fala", pesoM: 0.14, pesoF: 0.01 },
    { id: "sintoma_hiperatividade", label: "Hiperatividade", pesoM: 0.12, pesoF: 0.04 },
    { id: "sintoma_evita_contato_visual", label: "Evita Contato Visual", pesoM: 0.06, pesoF: 0.08 },
    { id: "sintoma_evita_contato_fisico", label: "Evita Contato Físico", pesoM: 0.04, pesoF: 0.07 },
    { id: "sintoma_agressividade", label: "Agressividade", pesoM: 0.01, pesoF: 0.02 }
];

document.addEventListener("DOMContentLoaded", function () {
    criarChecklistSintomas();
    configurarGenero();
    configurarFotos();
});

/* CRIA AS CAIXINHAS DO CHECKLIST */

function criarChecklistSintomas() {
    const gridSintomas = document.querySelector(".grid-sintomas");

    sintomasSXF.forEach(function (sintoma) {
        const div = document.createElement("div");

        div.className = "sintoma-item";
        div.id = `box_${sintoma.id}`;

        div.innerHTML = `
            <span class="sintoma-label">${sintoma.label}</span>

            <div class="sintoma-opcoes">
                <label>
                    <input type="radio" name="${sintoma.id}" value="1">
                    Sim
                </label>

                <label>
                    <input type="radio" name="${sintoma.id}" value="0" checked>
                    Não
                </label>
            </div>
        `;

        gridSintomas.appendChild(div);
    });
}

/* CONFIGURA O GÊNERO */

function configurarGenero() {
    const radiosGenero = document.querySelectorAll('input[name="genero"]');

    radiosGenero.forEach(function (radio) {
        radio.addEventListener("change", function () {
            const boxMacroorquidismo = document.getElementById("box_sintoma_macroorquidismo");

            if (radio.value === "Feminino") {
                boxMacroorquidismo.style.display = "none";
                document.querySelector('input[name="sintoma_macroorquidismo"][value="0"]').checked = true;
            } else {
                boxMacroorquidismo.style.display = "grid";
            }
        });
    });
}

/* CALCULA O SCORE */

function calcularScore() {
    const generoSelecionado = document.querySelector('input[name="genero"]:checked');

    const cardResultado = document.getElementById("resultadoScore");
    const tituloResultado = document.getElementById("tituloResultado");
    const textoResultado = document.getElementById("textoResultado");

    if (!generoSelecionado) {
        alert("Selecione o gênero antes de calcular o score.");
        return;
    }

    const genero = generoSelecionado.value;

    let scoreTotal = 0;

    sintomasSXF.forEach(function (sintoma) {
        const selecionado = document.querySelector(`input[name="${sintoma.id}"]:checked`);

        if (selecionado && selecionado.value === "1") {
            if (genero === "Masculino") {
                scoreTotal += sintoma.pesoM;
            } else {
                scoreTotal += sintoma.pesoF;
            }
        }
    });

    scoreTotal = parseFloat(scoreTotal.toFixed(2));

    let limiarCorte;

    if (genero === "Masculino") {
        limiarCorte = 0.56;
    } else {
        limiarCorte = 0.55;
    }

    cardResultado.classList.remove("oculto", "risco-alto", "risco-baixo");

    if (scoreTotal >= limiarCorte) {
        cardResultado.classList.add("risco-alto");
        tituloResultado.innerText = `ALTO RISCO (Score: ${scoreTotal})`;
        textoResultado.innerText = "Recomendado encaminhamento para teste genético confirmatório.";
    } else {
        cardResultado.classList.add("risco-baixo");
        tituloResultado.innerText = `BAIXO RISCO (Score: ${scoreTotal})`;
        textoResultado.innerText = "Paciente não atinge os critérios clínicos de corte atuais para a SXF.";
    }
}

/* FUNÇÕES DE MÁSCARA */

function deixarSoNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function aplicarMascaraCPF(input) {
    input.addEventListener("input", function () {
        let valor = deixarSoNumeros(input.value);

        valor = valor.slice(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

        input.value = valor;
    });
}

function aplicarMascaraTelefone(input) {
    input.addEventListener("input", function () {
        let valor = deixarSoNumeros(input.value);

        valor = valor.slice(0, 11);

        if (valor.length <= 10) {
            valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
            valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        } else {
            valor = valor.replace(/(\d{2})(\d)/, "($1) $2");
            valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        }

        input.value = valor;
    });
}

function aplicarMascaraPeso(input) {
    input.addEventListener("input", function () {
        let valor = input.value;

        valor = valor.replace(",", ".");
        valor = valor.replace(/[^0-9.]/g, "");

        const partes = valor.split(".");

        if (partes.length > 2) {
            valor = partes[0] + "." + partes.slice(1).join("");
        }

        input.value = valor.slice(0, 5);
    });
}

function limitarIdade(input) {
    input.addEventListener("input", function () {
        let valor = deixarSoNumeros(input.value);

        if (Number(valor) > 130) {
            valor = "130";
        }

        input.value = valor;
    });
}

aplicarMascaraCPF(cpfPaciente);
aplicarMascaraCPF(cpfAcompanhante);
aplicarMascaraTelefone(telefoneAcompanhante);
aplicarMascaraPeso(pesoPaciente);
limitarIdade(idadePaciente);

/* CONFIGURA AS FOTOS */

function configurarFotos() {
    configurarFoto("fotoFrente", "previewFrente", "iconeFrente", "frente");
    configurarFoto("fotoDireita", "previewDireita", "iconeDireita", "direita");
    configurarFoto("fotoEsquerda", "previewEsquerda", "iconeEsquerda", "esquerda");
}

function configurarFoto(idInput, idPreview, idIcone, tipoFoto) {
    const input = document.getElementById(idInput);
    const preview = document.getElementById(idPreview);
    const icone = document.getElementById(idIcone);

    input.addEventListener("change", function () {
        const arquivo = input.files[0];

        if (arquivo) {
            const leitor = new FileReader();

            leitor.onload = function (evento) {
                preview.src = evento.target.result;
                preview.style.display = "block";
                icone.style.display = "none";

                fotosPaciente[tipoFoto] = evento.target.result;
            };

            leitor.readAsDataURL(arquivo);
        }
    });
}

/* SALVA O CADASTRO */

function salvarCadastro() {
    const generoSelecionado = document.querySelector('input[name="genero"]:checked');

    if (
        nomePaciente.value.trim() === "" ||
        idadePaciente.value.trim() === "" ||
        pesoPaciente.value.trim() === "" ||
        cpfPaciente.value.trim() === "" ||
        nomeAcompanhante.value.trim() === "" ||
        cpfAcompanhante.value.trim() === "" ||
        telefoneAcompanhante.value.trim() === "" ||
        !generoSelecionado
    ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    if (cpfPaciente.value.length < 14) {
        alert("CPF do paciente incompleto.");
        return;
    }

    if (cpfAcompanhante.value.length < 14) {
        alert("CPF do acompanhante incompleto.");
        return;
    }

    if (
        fotosPaciente.frente === "" ||
        fotosPaciente.direita === "" ||
        fotosPaciente.esquerda === ""
    ) {
        alert("Adicione as 3 fotos do paciente: frente, lado direito e lado esquerdo.");
        return;
    }

    const pacientes = JSON.parse(localStorage.getItem("pacientesCRMJ")) || [];

    const novoPaciente = {
        nome: nomePaciente.value.trim(),
        idade: idadePaciente.value.trim(),
        peso: pesoPaciente.value.trim(),
        cpf: cpfPaciente.value.trim(),
        genero: generoSelecionado.value,

        acompanhante: {
            nome: nomeAcompanhante.value.trim(),
            cpf: cpfAcompanhante.value.trim(),
            telefone: telefoneAcompanhante.value.trim()
        },

        fotos: {
            frente: fotosPaciente.frente,
            direita: fotosPaciente.direita,
            esquerda: fotosPaciente.esquerda
        },

        status: "Ativo"
    };

    pacientes.push(novoPaciente);

    localStorage.setItem("pacientesCRMJ", JSON.stringify(pacientes));

    alert("Paciente cadastrado com sucesso!");

    window.location.href = "paciente.html";
}