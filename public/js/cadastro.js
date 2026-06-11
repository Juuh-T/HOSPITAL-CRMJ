
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
    const dataAdmissao = `${diaAdmissao.value}/${mesAdmissao.value}/${anoAdmissao.value}`;

    const data_aceite_termos = `${anoAdmissao.value}-${mesAdmissao.value}-${diaAdmissao.value}`;
    const nomeCompleto = `${nome} ${sobrenome}`;

    if (
        nome === "" ||
        sobrenome === "" ||
        cpf.value === "" ||
        usuario === "" ||
        senha === "" ||
        confirmarSenha === "" ||
        diaAdmissao.value === "" ||
        mesAdmissao.value === "" ||
        anoAdmissao.value === ""
    ) {
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

    //mandar pro cadastrar_medicos as informacoes
    fetch("../api/medicos/cadastrar_medico.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify
        ({
            nome: nomeCompleto,
            crm: usuario,
            senha: senha, 
            data_aceite_termos: data_aceite_termos
        })
    })

    .then ( function ( respostaPhp ){
        return respostaPhp.json();

    })
    //segudno then recebe dados do return do primeiro
    .then ( function ( dadosPhp ){
        if ( dadosPhp.status === false){
            alert(dadosPhp.mensagem);
        }

        else if ( dadosPhp.status === true){
            alert(dadosPhp.mensagem);
            window.location.href = "profissionais.html";
        }
    })

    .catch( function ( erro ){
        console.error("Erro ao cadastrar.", erro);
        alert("Erro ao conectar com o servidor.");
    })

    
}