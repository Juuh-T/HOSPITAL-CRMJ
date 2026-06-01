const cpf = document.getElementById("cpf");

const diaNascimento = document.getElementById("diaNascimento");
const mesNascimento = document.getElementById("mesNascimento");
const anoNascimento = document.getElementById("anoNascimento");

const diaAdmissao = document.getElementById("diaAdmissao");
const mesAdmissao = document.getElementById("mesAdmissao");
const anoAdmissao = document.getElementById("anoAdmissao");

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

limitarNumero(diaAdmissao, 31);
limitarNumero(mesAdmissao, 12);
limitarNumero(anoAdmissao, 9999);

function mostrarSenha(idInput, idIcone) {
    const input = document.getElementById(idInput);
    const icone = document.getElementById(idIcone);

    if (input.type === "password") {
        input.type = "text";

        icone.classList.remove("bi-eye-slash");
        icone.classList.add("bi-eye");
    } else {
        input.type = "password";

        icone.classList.remove("bi-eye");
        icone.classList.add("bi-eye-slash");
    }
}

function salvarCadastro() {
    const nome = document.getElementById("nome").value.trim();
    const sobrenome = document.getElementById("sobrenome").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value;
    const confirmarSenha = document.getElementById("confirmarSenha").value;

    if (nome === "" || sobrenome === "" || cpf.value === "" || usuario === "" || senha === "" || confirmarSenha === "") {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    if (cpf.value.length < 14) {
        alert("CPF incompleto.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não são iguais.");
        return;
    }

    alert("Cadastro realizado com sucesso!");

    window.location.href = "index.html";
}