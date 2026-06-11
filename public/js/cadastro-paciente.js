const cpf = document.getElementById("cpf");
const peso = document.getElementById("peso");

const diaNascimento = document.getElementById("diaNascimento");
const mesNascimento = document.getElementById("mesNascimento");
const anoNascimento = document.getElementById("anoNascimento");
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

document.addEventListener("DOMContentLoaded", () => {
    const gridSintomas = document.querySelector(".grid-sintomas");
    
    sintomasSXF.forEach(sintoma => {
        const div = document.createElement("div");
        div.className = "sintoma-item";
        div.id = `box_${sintoma.id}`;
        
        div.innerHTML = `
            <span class="sintoma-label">${sintoma.label}</span>
            <div class="sintoma-opcoes">
                <label><input type="radio" name="${sintoma.id}" value="1"> Sim</label>
                <label><input type="radio" name="${sintoma.id}" value="0" checked> Não</label>
            </div>
        `;
        gridSintomas.appendChild(div);
    });

    const selectSexo = document.getElementById("sexo");
    selectSexo.addEventListener("change", function() {
        const boxMacro = document.getElementById("box_sintoma_macroorquidismo");
        if(this.value === "Feminino") {
            boxMacro.style.display = "none";
            document.querySelector('input[name="sintoma_macroorquidismo"][value="0"]').checked = true;
        } else {
            boxMacro.style.display = "flex";
        }
    });
});

function calcularScore() {
    const sexo = document.getElementById("sexo").value;
    const cardResultado = document.getElementById("resultadoScore");
    const tituloResultado = document.getElementById("tituloResultado");
    const textoResultado = document.getElementById("textoResultado");

    if (!sexo) {
        alert("Por favor, selecione o Sexo Biológico antes de calcular o score.");
        return;
    }

    let scoreTotal = 0;

    sintomasSXF.forEach(sintoma => {
        const selecionado = document.querySelector(`input[name="${sintoma.id}"]:checked`);
        if (selecionado && selecionado.value === "1") {
            scoreTotal += (sexo === "Masculino") ? sintoma.pesoM : sintoma.pesoF;
        }
    });

    scoreTotal = parseFloat(scoreTotal.toFixed(2));
    
    const limiarCorte = (sexo === "Masculino") ? 0.56 : 0.55;
    
    cardResultado.classList.remove("oculto", "risco-alto", "risco-baixo");

    if (scoreTotal >= limiarCorte) {
        cardResultado.classList.add("risco-alto");
        tituloResultado.innerText = `ALTO RISCO (Score: ${scoreTotal})`;
        textoResultado.innerText = "Recomendado encaminhamento para teste genético confirmatório (PCR / Southern Blot).";
    } else {
        cardResultado.classList.add("risco-baixo");
        tituloResultado.innerText = `BAIXO RISCO (Score: ${scoreTotal})`;
        textoResultado.innerText = "Paciente não atinge os critérios clínicos de corte atuais para a SXF.";
    }
}

function previewFoto(input, index) {
    const previewImg = document.getElementById(`preview${index}`);
    const icone = document.getElementById(`icone${index}`);

    if (input.files && input.files[0]) {
        const leitor = new FileReader();
        leitor.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.classList.remove("oculto");
            icone.style.display = "none";
        }
        leitor.readAsDataURL(input.files[0]);
    }
}

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

peso.addEventListener("input", function () {
    let valor = peso.value;

    valor = valor.replace(",", ".");
    valor = valor.replace(/[^0-9.]/g, "");

    const partes = valor.split(".");

    if (partes.length > 2) {
        valor = partes[0] + "." + partes.slice(1).join("");
    }

    peso.value = valor.slice(0, 5);
});

function limitarNumero(input, maximo) {
    input.addEventListener("input", function () {
        let valor = deixarSoNumeros(input.value);

        if (Number(valor) > maximo) {
            valor = String(maximo);
        }

        input.value = valor;
    });
}

limitarNumero(diaNascimento, 31);
limitarNumero(mesNascimento, 12);
limitarNumero(anoNascimento, 9999);


function salvarCadastro() {
    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();

    const generoSelecionado = document.querySelector('input[name="genero"]:checked');

    const dataNascimento = `${diaNascimento.value}/${mesNascimento.value}/${anoNascimento.value}`;

    if (
        nome === "" ||
        sobrenome === "" ||
        cpf.value === "" ||
        peso.value === "" ||
        diaNascimento.value === "" ||
        mesNascimento.value === "" ||
        anoNascimento.value === "" ||
        !generoSelecionado
    ) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    if (cpf.value.length < 14) {
        alert("CPF incompleto.");
        return;
    }

    if (peso.value.length < 3) {
        alert("Preencha o peso corretamente ate 4 caracteres")
    }

    const pacientes = JSON.parse(localStorage.getItem("pacientesCRMJ")) || [];

    const novoPaciente = {
        nome: nome + " " + sobrenome,
        cpf: cpf.value,
        peso: peso.value,
        dataNascimento: dataNascimento,
        genero: generoSelecionado.value,
        foto: fotoPaciente,
        status: "Ativo"
    };

    pacientes.push(novoPaciente);

    if (
    fotosPaciente.frente === "" ||
    fotosPaciente.direita === "" ||
    fotosPaciente.esquerda === ""
    ) {
    alert("Adicione as 3 fotos do paciente: frente, lado direito e lado esquerdo.");
    return;
    }

    localStorage.setItem("pacientesCRMJ", JSON.stringify(pacientes));

    alert("Paciente cadastrado com sucesso!");

    window.location.href = "paciente.html";
}

let fotosPaciente = {
    frente: "",
    direita: "",
    esquerda: ""
};

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

configurarFoto("fotoFrente", "previewFrente", "iconeFrente", "frente");
configurarFoto("fotoDireita", "previewDireita", "iconeDireita", "direita");
configurarFoto("fotoEsquerda", "previewEsquerda", "iconeEsquerda", "esquerda");

inputFoto.addEventListener("change", function () {
    const arquivo = inputFoto.files[0];

    if (arquivo) {
        const leitor = new FileReader();

        leitor.onload = function (evento) {
            preview.src = evento.target.result;
            preview.style.display = "block";
            iconeCamera.style.display = "none";
            fotoPaciente = evento.target.result;
        };

        leitor.readAsDataURL(arquivo);
    }
});