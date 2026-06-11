const campoPesquisa = document.getElementById("pesquisa");
const filtrosStatus = document.querySelectorAll(".filtro-status");
const linhasProfissionais = document.getElementById("linhasProfissionais");

let profissionais = [];

fetch("/HOSPITAL-CRMJ/api/auth/sair_modo_medico.php")
.then(response => response.json())
.then(dados => {
    console.log("Modo médico encerrado.");
})
.catch(function (erro) {
    console.error("Erro ao sair do modo médico:", erro);
});

fetch("/HOSPITAL-CRMJ/api/medicos/listar_medicos.php")
.then(response => response.json())
.then(dados => {
    profissionais = dados.medicos;
    renderizarProfissionais();
});

function alterarStatus(idMedico, novoStatus) {
    fetch("/HOSPITAL-CRMJ/api/medicos/alterar_status.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_medico: idMedico,
            status: novoStatus
        })
    })
    .then(response => response.json())
    .then(dados => {
        if (dados.status) {
            const medico = profissionais.find(p => p.id_medico == idMedico);
            if (medico) {medico.status = novoStatus;}
            filtrarProfissionais();
        } else {alert(dados.mensagem);}
    })
    .catch(function (erro) {
        console.error(erro);
        alert("Erro ao alterar status do profissional.");
    });
}

function renderizarProfissionais(lista = profissionais) {
    linhasProfissionais.innerHTML = "";

    if (lista.length === 0) {
        linhasProfissionais.innerHTML = `
            <p class="mensagem-vazia">Nenhum profissional cadastrado.</p>
        `;
        return;
    }

    lista.forEach(function (profissional) {
        const linha = document.createElement("div");
        linha.classList.add("linha-profissional");
        linha.dataset.nome = profissional.nome.toLowerCase();
        linha.dataset.status = profissional.status.toLowerCase();
        linha.innerHTML = `
            <span>${profissional.id_medico}</span>
            <span>${profissional.nome}</span>
            <span>${profissional.crm}</span>

            <div class="status-dropdown">
                <div class="status-atual" onclick="toggleStatusMenu(this)">
                    ${profissional.status}
                    <i class="bi bi-chevron-down"></i>
                </div>

                <div class="status-opcoes">
                    <div class="${profissional.status === "ATIVO" ? "selecionado" : ""}"
                        onclick="alterarStatus(${profissional.id_medico}, 'ATIVO')">
                        Ativo
                    </div>
                    <div class="${profissional.status === "FERIAS" ? "selecionado" : ""}"
                        onclick="alterarStatus(${profissional.id_medico}, 'FERIAS')">
                        Férias
                    </div>
                    <div class="${profissional.status === "DESATIVADO" ? "selecionado" : ""}"
                        onclick="alterarStatus(${profissional.id_medico}, 'DESATIVADO')">
                        Desativado
                    </div>
                </div>
            </div>
        `;

        linha.addEventListener("click", function (event) {
            if (event.target.closest(".status-dropdown")) {return;}
            fetch("/HOSPITAL-CRMJ/api/auth/assumir_medico.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_medico: profissional.id_medico
                })
            })
            .then(response => response.json())
            .then(dados => {
                if (dados.status) {window.location.href = "paciente.html";} 
                else {alert(dados.mensagem);}
            })
            .catch(function (erro) {
                console.error(erro);
                alert("Erro ao acessar médico.");
            });
        });

        linhasProfissionais.appendChild(linha);
    });
}

function filtrarProfissionais() {
    const textoPesquisa = campoPesquisa.value.toLowerCase();
    const statusSelecionados = Array.from(filtrosStatus)
        .filter(filtro => filtro.checked)
        .map(filtro => filtro.value.toLowerCase());
    const filtrados = profissionais.filter(function (p) {
        const correspondePesquisa = p.nome.toLowerCase().includes(textoPesquisa) || p.crm.toLowerCase().includes(textoPesquisa);
        const correspondeStatus = statusSelecionados.length === 0 || statusSelecionados.includes(p.status.toLowerCase());
        return correspondePesquisa && correspondeStatus;
    });

    renderizarProfissionais(filtrados);

}

function toggleStatusMenu(elemento) {
    const dropdownAtual = elemento.parentElement;
    const linhaAtual = elemento.closest(".linha-profissional");
    const menuAtual = dropdownAtual.querySelector(".status-opcoes");

    document.querySelectorAll(".status-opcoes").forEach(function (menu) {
        if (menu !== menuAtual) {
            menu.style.display = "none";
        }
    });

    document.querySelectorAll(".linha-profissional").forEach(function (linha) {
        if (linha !== linhaAtual) {
            linha.classList.remove("menu-aberto");
        }
    });

    if (menuAtual.style.display === "block") {
        menuAtual.style.display = "none";
        linhaAtual.classList.remove("menu-aberto");
    } else {
        menuAtual.style.display = "block";
        linhaAtual.classList.add("menu-aberto");
    }
}

campoPesquisa.addEventListener("input", filtrarProfissionais);

filtrosStatus.forEach(function (filtro) {
    filtro.addEventListener("change", filtrarProfissionais);
});

document.addEventListener("click", function (event) {
    if (!event.target.closest(".status-dropdown")) {
        document.querySelectorAll(".status-opcoes").forEach(function (menu) {
            menu.style.display = "none";
        });

        document.querySelectorAll(".linha-profissional").forEach(function (linha) {
            linha.classList.remove("menu-aberto");
        });
    }
});