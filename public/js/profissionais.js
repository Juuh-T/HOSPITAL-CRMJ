const campoPesquisa = document.getElementById("pesquisa");
const filtrosStatus = document.querySelectorAll(".filtro-status");
const linhasProfissionais = document.getElementById("linhasProfissionais");
const btnExcluir = document.getElementById("btnExcluir");

let profissionais = JSON.parse(localStorage.getItem("profissionaisCRMJ")) || [];
let profissionalSelecionado = null;

function salvarProfissionais() {
    localStorage.setItem("profissionaisCRMJ", JSON.stringify(profissionais));
}

function atualizarBotaoExcluir() {
    if (profissionalSelecionado === null) {
        btnExcluir.disabled = true;
        btnExcluir.classList.remove("ativo");
    } else {
        btnExcluir.disabled = false;
        btnExcluir.classList.add("ativo");
    }
}

function selecionarProfissional(index) {
    profissionalSelecionado = index;

    const linhas = document.querySelectorAll(".linha-profissional");

    linhas.forEach(function (linha) {
        linha.classList.remove("selecionado");
    });

    const linhaSelecionada = document.querySelector(`.linha-profissional[data-index="${index}"]`);

    if (linhaSelecionada) {
        linhaSelecionada.classList.add("selecionado");
    }

    atualizarBotaoExcluir();
}

function renderizarProfissionais() {
    linhasProfissionais.innerHTML = "";

    if (profissionais.length === 0) {
        linhasProfissionais.innerHTML = `
            <p class="mensagem-vazia">Nenhum profissional cadastrado.</p>
        `;

        profissionalSelecionado = null;
        atualizarBotaoExcluir();
        return;
    }

    profissionais.forEach(function (profissional, index) {
        const linha = document.createElement("div");
        linha.classList.add("linha-profissional");

        linha.dataset.index = index;
        linha.dataset.nome = profissional.nome.toLowerCase();
        linha.dataset.status = profissional.status;

        if (profissionalSelecionado === index) {
            linha.classList.add("selecionado");
        }

        linha.innerHTML = `
            <span>${index + 1}</span>
            <span>${profissional.nome}</span>
            <span>${profissional.dataAdmissao}</span>

            <div class="status-dropdown">
                <div class="status-atual" onclick="toggleStatusMenu(this)">
                    ${profissional.status}
                </div>

                <div class="status-opcoes">
                    <div class="${profissional.status === "Ativo" ? "selecionado" : ""}" onclick="alterarStatus(${index}, 'Ativo')">Ativo</div>
                    <div class="${profissional.status === "Férias" ? "selecionado" : ""}" onclick="alterarStatus(${index}, 'Férias')">Férias</div>
                    <div class="${profissional.status === "Desativado" ? "selecionado" : ""}" onclick="alterarStatus(${index}, 'Desativado')">Desativado</div>
                </div>
            </div>
        `;

        linha.addEventListener("click", function (event) {
            if (event.target.closest(".status-dropdown")) {
                return;
            }

            selecionarProfissional(index);
        });

        linhasProfissionais.appendChild(linha);
    });

    filtrarProfissionais();
    atualizarBotaoExcluir();
}

function excluirProfissionalSelecionado() {
    if (profissionalSelecionado === null) {
        return;
    }

    const confirmar = confirm("Deseja excluir este profissional?");

    if (confirmar === false) {
        return;
    }

    profissionais.splice(profissionalSelecionado, 1);

    profissionalSelecionado = null;

    salvarProfissionais();
    renderizarProfissionais();
}

function filtrarProfissionais() {
    const textoPesquisa = campoPesquisa.value.toLowerCase().trim();
    const linhas = document.querySelectorAll(".linha-profissional");

    const statusSelecionados = [];

    filtrosStatus.forEach(function (filtro) {
        if (filtro.checked) {
            statusSelecionados.push(filtro.value);
        }
    });

    linhas.forEach(function (linha) {
        const nome = linha.dataset.nome;
        const status = linha.dataset.status;

        const nomeCombina = nome.includes(textoPesquisa);
        const statusCombina = statusSelecionados.length === 0 || statusSelecionados.includes(status);

        if (nomeCombina && statusCombina) {
            linha.style.display = "grid";
        } else {
            linha.style.display = "none";
        }
    });
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

function alterarStatus(index, novoStatus) {
    profissionais[index].status = novoStatus;

    salvarProfissionais();
    renderizarProfissionais();
}

campoPesquisa.addEventListener("input", filtrarProfissionais);

filtrosStatus.forEach(function (filtro) {
    filtro.addEventListener("change", filtrarProfissionais);
});

btnExcluir.addEventListener("click", excluirProfissionalSelecionado);

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

renderizarProfissionais();