const cpf = document.getElementById("cpf");
const peso = document.getElementById("peso");

const diaNascimento = document.getElementById("diaNascimento");
const mesNascimento = document.getElementById("mesNascimento");
const anoNascimento = document.getElementById("anoNascimento");


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