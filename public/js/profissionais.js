// função pra verificar se o usuário tem permissão de estar aqui, ou seja, se é admin
window.onload = js_autenticarQuemTaAqui;

function js_autenticarQuemTaAqui() {

    fetch("../api/auth/verificar_sessao.php")
        .then(function (respostaVerSes) {
            return respostaVerSes.json();
        })
        .then(function (dados) {

            if (dados.administrador === true) {
                alert("Seja bem vindo " + dados.nome);
                js_carregarProfissionais();
            } else {
                alert("Acesso apenas para administradores.");
                window.location.href = "paciente.html";
                return;
            }

        })
        .catch(function (erro) {
            console.error("Erro ao verificar sessão:", erro);
            alert("Erro ao verificar sessão.");
        });
}

function js_carregarProfissionais() {

    const campoPesquisa = document.getElementById("pesquisa");
    const filtrosStatus = document.querySelectorAll(".filtro-status");
    const linhasProfissionais = document.getElementById("linhasProfissionais");
    const btnPesquisar = document.getElementById("btnPesquisar");

    let profissionais = [];

    fetch("/HOSPITAL-CRMJ/api/auth/sair_modo_medico.php")
        .then(function (response) {
            return response.json();
        })
        .then(function () {
            console.log("Modo médico encerrado.");

            return fetch("/HOSPITAL-CRMJ/api/medicos/listar_medicos.php");
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (dados) {
            console.log("Resposta listar_medicos:", dados);

            profissionais = dados.medicos || dados.profissionais || [];

            renderizarProfissionais(profissionais);
        })
        .catch(function (erro) {
            console.error("Erro ao carregar profissionais:", erro);
            alert("Erro ao carregar profissionais.");
        });

    window.alterarStatus = function alterarStatus(idMedico, novoStatus) {

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
            .then(function (response) {
                return response.json();
            })
            .then(function (dados) {

                if (dados.status) {
                    const medico = profissionais.find(function (p) {
                        return p.id_medico == idMedico;
                    });

                    if (medico) {
                        medico.status = novoStatus;
                        medico.status_medico = novoStatus;
                    }

                    filtrarProfissionais();

                } else {
                    alert(dados.mensagem);
                }

            })
            .catch(function (erro) {
                console.error(erro);
                alert("Erro ao alterar status do profissional.");
            });
    };

    function renderizarProfissionais(lista = profissionais) {

        linhasProfissionais.innerHTML = "";

        if (!lista || lista.length === 0) {
            linhasProfissionais.innerHTML = `
                <p class="mensagem-vazia">Nenhum profissional cadastrado.</p>
            `;
            return;
        }

        lista.forEach(function (profissional) {

            const status = profissional.status || profissional.status_medico || "";

            const linha = document.createElement("div");
            linha.classList.add("linha-profissional");

            linha.dataset.nome = profissional.nome.toLowerCase();
            linha.dataset.status = status.toLowerCase();

            linha.innerHTML = `
                <span>${profissional.id_medico}</span>
                <span>${profissional.nome}</span>
                <span>${profissional.crm}</span>

                <div class="status-dropdown">
                    <div class="status-atual" onclick="toggleStatusMenu(this)">
                        ${status}
                        <i class="bi bi-chevron-down"></i>
                    </div>

                    <div class="status-opcoes">
                        <div class="${status === "ATIVO" ? "selecionado" : ""}"
                            onclick="alterarStatus(${profissional.id_medico}, 'ATIVO')">
                            Ativo
                        </div>

                        <div class="${status === "FERIAS" ? "selecionado" : ""}"
                            onclick="alterarStatus(${profissional.id_medico}, 'FERIAS')">
                            Férias
                        </div>

                        <div class="${status === "DESATIVADO" ? "selecionado" : ""}"
                            onclick="alterarStatus(${profissional.id_medico}, 'DESATIVADO')">
                            Desativado
                        </div>
                    </div>
                </div>
            `;

            linha.addEventListener("click", function (event) {

                if (event.target.closest(".status-dropdown")) {
                    return;
                }

                fetch("/HOSPITAL-CRMJ/api/auth/assumir_medico.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id_medico: profissional.id_medico
                    })
                })
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (dados) {

                        if (dados.status) {
                            window.location.href = "paciente.html";
                        } else {
                            alert(dados.mensagem);
                        }

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
            .filter(function (filtro) {
                return filtro.checked;
            })
            .map(function (filtro) {
                return filtro.value.toLowerCase();
            });

        const filtrados = profissionais.filter(function (p) {

            const status = p.status || p.status_medico || "";

            const correspondePesquisa =
                p.nome.toLowerCase().includes(textoPesquisa) ||
                p.crm.toLowerCase().includes(textoPesquisa);

            const correspondeStatus =
                statusSelecionados.length === 0 ||
                statusSelecionados.includes(status.toLowerCase());

            return correspondePesquisa && correspondeStatus;
        });

        renderizarProfissionais(filtrados);
    }

    window.toggleStatusMenu = function toggleStatusMenu(elemento) {

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
    };

    campoPesquisa.addEventListener("input", filtrarProfissionais);

    btnPesquisar.addEventListener("click", filtrarProfissionais);

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
}