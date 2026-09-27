// ==========================================
// CONEXÃO COM O SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://bhvyqqrywhnhnbhrryzy.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_gLVTUFpnrkbAMrBvhI-ukg_nbFwDtXH";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// VARIÁVEIS
// ==========================================

let produtosOP = [];
let produtosSimulacao = [];
let componentes = [];

let produtoOPSelecionado = null;
let componenteSelecionado = null;


// ==========================================
// MENSAGENS DE STATUS
// ==========================================

function mostrarStatus(elemento, mensagem, tipo = "sucesso") {

    const status = document.getElementById(elemento);

    status.textContent = mensagem;

    status.className = "status " + tipo;

    setTimeout(() => {
        status.className = "status";
    }, 4000);
}


// ==========================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ==========================================

function mostrarPagina(pagina) {

    const ordem =
        document.getElementById("paginaOrdem");

    const simulacao =
        document.getElementById("paginaSimulacao");

    const btnOrdem =
        document.getElementById("btnOrdem");

    const btnSimulacao =
        document.getElementById("btnSimulacao");


    ordem.classList.remove("ativa");
    simulacao.classList.remove("ativa");

    btnOrdem.classList.remove("ativo");
    btnSimulacao.classList.remove("ativo");


    if (pagina === "ordem") {

        ordem.classList.add("ativa");
        btnOrdem.classList.add("ativo");

        carregarOP();
    }


    if (pagina === "simulacao") {

        simulacao.classList.add("ativa");
        btnSimulacao.classList.add("ativo");

        carregarProdutosSimulacao();
    }
}


// ==========================================
// ORDEM DE PRODUÇÃO
// ==========================================

async function carregarOP() {

    const { data, error } =
        await supabaseClient
            .from("produtos_op")
            .select("*")
            .order("ordem", {
                ascending: true
            });


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusOP",
            "Erro ao carregar os produtos: " +
            error.message,
            "erro"
        );

        return;
    }


    produtosOP = data || [];

    renderizarOP();
}


// ==========================================
// RENDERIZAR TABELA DE OP
// ==========================================

function renderizarOP(lista = produtosOP) {

    const tabela =
        document.getElementById("tabelaOP");

    tabela.innerHTML = "";


    if (lista.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td colspan="5" class="mensagem-vazia">
                    Nenhum produto encontrado.
                </td>
            </tr>
        `;

        return;
    }


    lista.forEach(produto => {

        const tr =
            document.createElement("tr");


        if (
            produtoOPSelecionado &&
            produtoOPSelecionado.id === produto.id
        ) {

            tr.classList.add("selecionada");
        }


        tr.innerHTML = `

            <td>${produto.codigo || ""}</td>

            <td>${produto.linha || ""}</td>

            <td>${produto.quantidade_embalagem || ""}</td>

            <td>${produto.subconjunto || ""}</td>

            <td>${produto.ordem || ""}</td>

        `;


        tr.addEventListener("click", () => {

            produtoOPSelecionado = produto;


            document.getElementById("codigoOP").value =
                produto.codigo || "";

            document.getElementById("linhaOP").value =
                produto.linha || "";

            document.getElementById("quantidadeEmbalagemOP").value =
                produto.quantidade_embalagem || "";

            document.getElementById("subconjuntoOP").value =
                produto.subconjunto || "";

            document.getElementById("ordemOP").value =
                produto.ordem || "";


            renderizarOP(lista);
        });


        tabela.appendChild(tr);
    });
}


// ==========================================
// CADASTRAR OP
// ==========================================

async function cadastrarOP() {

    const codigo =
        document.getElementById("codigoOP").value.trim();

    const linha =
        document.getElementById("linhaOP").value.trim();

    const quantidadeEmbalagem =
        document
            .getElementById("quantidadeEmbalagemOP")
            .value;

    const subconjunto =
        document
            .getElementById("subconjuntoOP")
            .value.trim();

    const ordem =
        document
            .getElementById("ordemOP")
            .value;


    if (
        !codigo ||
        !linha ||
        !quantidadeEmbalagem ||
        !subconjunto ||
        !ordem
    ) {

        mostrarStatus(
            "statusOP",
            "Preencha todos os campos.",
            "erro"
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("produtos_op")
            .insert([{

                codigo: codigo,

                linha: linha,

                quantidade_embalagem:
                    Number(quantidadeEmbalagem),

                subconjunto: subconjunto,

                ordem: Number(ordem)

            }]);


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusOP",
            "Erro ao cadastrar: " +
            error.message,
            "erro"
        );

        return;
    }


    mostrarStatus(
        "statusOP",
        "Produto cadastrado com sucesso!"
    );


    limparOP();

    carregarOP();
}


// ==========================================
// EDITAR OP
// ==========================================

async function editarOP() {

    if (!produtoOPSelecionado) {

        mostrarStatus(
            "statusOP",
            "Selecione um produto para editar.",
            "erro"
        );

        return;
    }


    const codigo =
        document.getElementById("codigoOP").value.trim();

    const linha =
        document.getElementById("linhaOP").value.trim();

    const quantidadeEmbalagem =
        document
            .getElementById("quantidadeEmbalagemOP")
            .value;

    const subconjunto =
        document
            .getElementById("subconjuntoOP")
            .value.trim();

    const ordem =
        document
            .getElementById("ordemOP")
            .value;


    if (
        !codigo ||
        !linha ||
        !quantidadeEmbalagem ||
        !subconjunto ||
        !ordem
    ) {

        mostrarStatus(
            "statusOP",
            "Preencha todos os campos.",
            "erro"
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("produtos_op")
            .update({

                codigo: codigo,

                linha: linha,

                quantidade_embalagem:
                    Number(quantidadeEmbalagem),

                subconjunto: subconjunto,

                ordem: Number(ordem)

            })
            .eq(
                "id",
                produtoOPSelecionado.id
            );


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusOP",
            "Erro ao editar: " +
            error.message,
            "erro"
        );

        return;
    }


    mostrarStatus(
        "statusOP",
        "Produto atualizado com sucesso!"
    );


    limparOP();

    carregarOP();
}


// ==========================================
// EXCLUIR OP
// ==========================================

async function excluirOP() {

    if (!produtoOPSelecionado) {

        mostrarStatus(
            "statusOP",
            "Selecione um produto para excluir.",
            "erro"
        );

        return;
    }


    const produto =
        produtosOP.find(
            p =>
                p.id ===
                produtoOPSelecionado.id
        );


    if (!produto) {
        return;
    }


    const confirmar =
        confirm(
            "Deseja realmente excluir este produto?"
        );


    if (!confirmar) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("produtos_op")
            .delete()
            .eq(
                "id",
                produto.id
            );


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusOP",
            "Erro ao excluir: " +
            error.message,
            "erro"
        );

        return;
    }


    mostrarStatus(
        "statusOP",
        "Produto excluído com sucesso!"
    );


    limparOP();

    carregarOP();
}


// ==========================================
// LIMPAR OP
// ==========================================

function limparOP() {

    document.getElementById("codigoOP").value = "";

    document.getElementById("linhaOP").value = "";

    document.getElementById(
        "quantidadeEmbalagemOP"
    ).value = "";

    document.getElementById("subconjuntoOP").value = "";

    document.getElementById("ordemOP").value = "";


    produtoOPSelecionado = null;

    renderizarOP();
}


// ==========================================
// PESQUISAR OP
// ==========================================

function pesquisarOP() {

    const pesquisa =
        document
            .getElementById("pesquisaOP")
            .value
            .toLowerCase()
            .trim();


    if (!pesquisa) {

        renderizarOP();

        return;
    }


    const resultado =
        produtosOP.filter(produto => {

            return (

                String(
                    produto.codigo || ""
                )
                    .toLowerCase()
                    .includes(pesquisa)

                ||

                String(
                    produto.linha || ""
                )
                    .toLowerCase()
                    .includes(pesquisa)

                ||

                String(
                    produto.subconjunto || ""
                )
                    .toLowerCase()
                    .includes(pesquisa)

                ||

                String(
                    produto.ordem || ""
                )
                    .toLowerCase()
                    .includes(pesquisa)

            );

        });


    renderizarOP(resultado);
}


// ==========================================
// PRODUTOS DA SIMULAÇÃO
// ==========================================

async function carregarProdutosSimulacao() {

    const { data, error } =
        await supabaseClient
            .from("produtos_simulacao")
            .select("*")
            .order("nome", {
                ascending: true
            });


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusSimulacao",
            "Erro ao carregar produtos: " +
            error.message,
            "erro"
        );

        return;
    }


    produtosSimulacao = data || [];


    const select =
        document.getElementById(
            "produtoSimulacao"
        );


    const valorAtual =
        select.value;


    select.innerHTML = `
        <option value="">
            Selecione um produto
        </option>
    `;


    produtosSimulacao.forEach(produto => {

        const option =
            document.createElement("option");


        option.value = produto.id;

        option.textContent = produto.nome;


        select.appendChild(option);
    });


    if (
        valorAtual &&
        produtosSimulacao.some(
            p =>
                String(p.id) ===
                String(valorAtual)
        )
    ) {

        select.value = valorAtual;
    }


    carregarComponentes();
}


// ==========================================
// CARREGAR COMPONENTES
// ==========================================

async function carregarComponentes() {

    const produtoId =
        document.getElementById(
            "produtoSimulacao"
        ).value;


    const tabela =
        document.getElementById(
            "tabelaComponentes"
        );


    componenteSelecionado = null;

    tabela.innerHTML = "";


    if (!produtoId) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="mensagem-vazia">
                    Selecione um produto.
                </td>
            </tr>
        `;

        componentes = [];

        return;
    }


    const { data, error } =
        await supabaseClient
            .from("componentes")
            .select("*")
            .eq("produto_id", produtoId)
            .order("nome", {
                ascending: true
            });


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusSimulacao",
            "Erro ao carregar componentes: " +
            error.message,
            "erro"
        );

        return;
    }


    componentes = data || [];


    if (componentes.length === 0) {

        tabela.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="mensagem-vazia">
                    Nenhum componente cadastrado.
                </td>
            </tr>
        `;

        return;
    }


    componentes.forEach(componente => {

        const tr =
            document.createElement("tr");


        tr.innerHTML = `

            <td>${componente.nome || ""}</td>

            <td>
                ${formatarNumero(
                    componente.quantidade
                )}
            </td>

            <td>${componente.embalagem || ""}</td>

            <td>
                ${formatarNumero(
                    componente.capacidade
                )}
            </td>

        `;


        tr.addEventListener("click", () => {

            componenteSelecionado =
                componente;


            document
                .querySelectorAll(
                    "#tabelaComponentes tr"
                )
                .forEach(linha => {

                    linha.classList.remove(
                        "selecionada"
                    );

                });


            tr.classList.add(
                "selecionada"
            );

        });


        tabela.appendChild(tr);
    });
}


// ==========================================
// MODAL DE PRODUTO
// ==========================================

function abrirModalProduto() {

    document
        .getElementById("modalProduto")
        .classList.add("ativo");


    document
        .getElementById("nomeNovoProduto")
        .focus();
}


function fecharModalProduto() {

    document
        .getElementById("modalProduto")
        .classList.remove("ativo");
}


// ==========================================
// CRIAR PRODUTO
// ==========================================

async function criarProduto() {

    const nome =
        document
            .getElementById("nomeNovoProduto")
            .value
            .trim();


    if (!nome) {

        mostrarStatus(
            "statusSimulacao",
            "Digite o nome do produto.",
            "erro"
        );

        return;
    }


    const { data, error } =
        await supabaseClient
            .from("produtos_simulacao")
            .insert([{
                nome: nome
            }])
            .select()
            .single();


    if (error) {

        console.error(error);


        if (error.code === "23505") {

            mostrarStatus(
                "statusSimulacao",
                "Este produto já existe.",
                "erro"
            );

        } else {

            mostrarStatus(
                "statusSimulacao",
                "Erro ao criar produto: " +
                error.message,
                "erro"
            );
        }

        return;
    }


    document
        .getElementById("nomeNovoProduto")
        .value = "";


    fecharModalProduto();


    await carregarProdutosSimulacao();


    document.getElementById(
        "produtoSimulacao"
    ).value = data.id;


    await carregarComponentes();


    mostrarStatus(
        "statusSimulacao",
        "Produto criado com sucesso!"
    );
}


// ==========================================
// EXCLUIR PRODUTO
// ==========================================

async function excluirProduto() {

    const produtoId =
        document.getElementById(
            "produtoSimulacao"
        ).value;


    if (!produtoId) {

        mostrarStatus(
            "statusSimulacao",
            "Selecione um produto para excluir.",
            "erro"
        );

        return;
    }


    const produto =
        produtosSimulacao.find(
            p =>
                String(p.id) ===
                String(produtoId)
        );


    if (!produto) {
        return;
    }


    const confirmar =
        confirm(
            "Deseja realmente excluir o produto? " +
            "Os componentes relacionados também serão excluídos."
        );


    if (!confirmar) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("produtos_simulacao")
            .delete()
            .eq("id", produtoId);


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusSimulacao",
            "Erro ao excluir produto: " +
            error.message,
            "erro"
        );

        return;
    }


    document.getElementById(
        "produtoSimulacao"
    ).value = "";


    componentes = [];

    componenteSelecionado = null;


    document.getElementById(
        "tabelaComponentes"
    ).innerHTML = `
        <tr>
            <td
                colspan="4"
                class="mensagem-vazia">
                Selecione um produto.
            </td>
        </tr>
    `;


    document.getElementById(
        "resultadoSimulacao"
    ).innerHTML = "";


    await carregarProdutosSimulacao();


    mostrarStatus(
        "statusSimulacao",
        "Produto excluído com sucesso!"
    );
}


// ==========================================
// MODAL DE COMPONENTE
// ==========================================

function abrirModalComponente() {

    const produtoId =
        document.getElementById(
            "produtoSimulacao"
        ).value;


    if (!produtoId) {

        mostrarStatus(
            "statusSimulacao",
            "Selecione um produto primeiro.",
            "erro"
        );

        return;
    }


    document
        .getElementById("modalComponente")
        .classList.add("ativo");
}


function fecharModalComponente() {

    document
        .getElementById("modalComponente")
        .classList.remove("ativo");
}


// ==========================================
// CRIAR COMPONENTE
// ==========================================

async function criarComponente() {

    const produtoId =
        document.getElementById(
            "produtoSimulacao"
        ).value;


    const nome =
        document
            .getElementById("nomeComponente")
            .value
            .trim();


    const quantidade =
        document
            .getElementById(
                "quantidadeComponente"
            )
            .value;


    const embalagem =
        document
            .getElementById(
                "embalagemComponente"
            )
            .value
            .trim();


    const capacidade =
        document
            .getElementById(
                "capacidadeComponente"
            )
            .value;


    if (
        !produtoId ||
        !nome ||
        !quantidade ||
        !embalagem ||
        !capacidade
    ) {

        mostrarStatus(
            "statusSimulacao",
            "Preencha todos os campos do componente.",
            "erro"
        );

        return;
    }


    const { error } =
        await supabaseClient
            .from("componentes")
            .insert([{

                produto_id: produtoId,

                nome: nome,

                quantidade:
                    Number(quantidade),

                embalagem: embalagem,

                capacidade:
                    Number(capacidade)

            }]);


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusSimulacao",
            "Erro ao criar componente: " +
            error.message,
            "erro"
        );

        return;
    }


    document.getElementById(
        "nomeComponente"
    ).value = "";


    document.getElementById(
        "quantidadeComponente"
    ).value = "";


    document.getElementById(
        "embalagemComponente"
    ).value = "";


    document.getElementById(
        "capacidadeComponente"
    ).value = "";


    fecharModalComponente();


    await carregarComponentes();


    mostrarStatus(
        "statusSimulacao",
        "Componente criado com sucesso!"
    );
}


// ==========================================
// EXCLUIR COMPONENTE
// ==========================================

async function excluirComponente() {

    const produtoId =
        document.getElementById(
            "produtoSimulacao"
        ).value;


    if (!produtoId) {

        mostrarStatus(
            "statusSimulacao",
            "Selecione um produto.",
            "erro"
        );

        return;
    }


    if (!componenteSelecionado) {

        mostrarStatus(
            "statusSimulacao",
            "Selecione um componente.",
            "erro"
        );

        return;
    }


    const componente =
        componentes.find(
            c =>
                c.id ===
                componenteSelecionado.id
        );


    if (!componente) {
        return;
    }


    const confirmar =
        confirm(
            "Deseja realmente excluir este componente?"
        );


    if (!confirmar) {
        return;
    }


    const { error } =
        await supabaseClient
            .from("componentes")
            .delete()
            .eq(
                "id",
                componente.id
            );


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusSimulacao",
            "Erro ao excluir componente: " +
            error.message,
            "erro"
        );

        return;
    }


    componenteSelecionado = null;


    await carregarComponentes();


    mostrarStatus(
        "statusSimulacao",
        "Componente excluído com sucesso!"
    );
}


// ==========================================
// CALCULAR PRODUÇÃO
// ==========================================

async function calcularProducao() {

    const produtoId =
        document.getElementById(
            "produtoSimulacao"
        ).value;


    const quantidade =
        Number(
            document.getElementById(
                "quantidadeProducao"
            ).value
        );


    if (!produtoId) {

        mostrarStatus(
            "statusSimulacao",
            "Selecione um produto.",
            "erro"
        );

        return;
    }


    if (!quantidade || quantidade <= 0) {

        mostrarStatus(
            "statusSimulacao",
            "Informe uma quantidade válida.",
            "erro"
        );

        return;
    }


    const produto =
        produtosSimulacao.find(
            p =>
                String(p.id) ===
                String(produtoId)
        );


    if (!produto) {

        mostrarStatus(
            "statusSimulacao",
            "Produto não encontrado.",
            "erro"
        );

        return;
    }


    const { data, error } =
        await supabaseClient
            .from("componentes")
            .select("*")
            .eq("produto_id", produtoId)
            .order("nome", {
                ascending: true
            });


    if (error) {

        console.error(error);

        mostrarStatus(
            "statusSimulacao",
            "Erro ao calcular produção: " +
            error.message,
            "erro"
        );

        return;
    }


    if (!data || data.length === 0) {

        mostrarStatus(
            "statusSimulacao",
            "Este produto não possui componentes.",
            "erro"
        );

        return;
    }


    let html = `

        <h3>
            Resultado da Produção
        </h3>

        <p>
            Produto:
            <strong>${produto.nome}</strong>
        </p>

        <p>
            Quantidade a produzir:
            <strong>${formatarNumero(quantidade)}</strong>
        </p>

        <div class="tabela-container">

            <table>

                <thead>

                    <tr>

                        <th>Componente</th>

                        <th>Necessário</th>

                        <th>Embalagem</th>

                        <th>Qtd. por Embalagem</th>

                        <th>Pegar</th>

                    </tr>

                </thead>

                <tbody>
    `;


    data.forEach(componente => {

        const necessario =
            quantidade *
            Number(componente.quantidade);


        const embalagens =
            Math.ceil(
                necessario /
                Number(componente.capacidade)
            );


        html += `

            <tr>

                <td>
                    ${componente.nome}
                </td>

                <td>
                    ${formatarNumero(
                        necessario
                    )}
                </td>

                <td>
                    ${componente.embalagem}
                </td>

                <td>
                    ${formatarNumero(
                        componente.capacidade
                    )}
                </td>

                <td>
                    <strong>
                        ${embalagens}
                    </strong>
                </td>

            </tr>

        `;
    });


    html += `

                </tbody>

            </table>

        </div>

    `;


    document.getElementById(
        "resultadoSimulacao"
    ).innerHTML = html;
}


// ==========================================
// FORMATAR NÚMEROS
// ==========================================

function formatarNumero(numero) {

    return Number(numero).toLocaleString(
        "pt-BR",
        {
            maximumFractionDigits: 2
        }
    );
}


// ==========================================
// INICIAR SISTEMA
// ==========================================

async function iniciarSistema() {

    console.log(
        "Iniciando Sistema de Produção..."
    );


    await carregarOP();

    await carregarProdutosSimulacao();


    console.log(
        "Sistema conectado!"
    );
}

function fazerLogin() {

    const usuario = document.getElementById("usuarioLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    if (usuario === "admin" && senha === "1234") {

        document.getElementById("telaLogin").style.display = "none";

        document.getElementById("sistema").style.display = "block";

    } else {

        document.getElementById("mensagemLogin").textContent =
            "Usuário ou senha incorretos.";

    }
}

function fazerLogin() {

    const usuario = document.getElementById("usuarioLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    if (usuario === "admin" && senha === "1234") {

        document.getElementById("telaLogin").style.display = "none";

        document.getElementById("sistema").style.display = "block";

    } else {

        document.getElementById("mensagemLogin").textContent =
            "Usuário ou senha incorretos.";

    }
}

iniciarSistema();