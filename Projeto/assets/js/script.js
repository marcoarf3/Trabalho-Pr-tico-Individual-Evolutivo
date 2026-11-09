"use strict";

const CHAVE_STORAGE = "mygames:jogos";
const API_OFERTAS = "https://www.cheapshark.com/api/1.0/deals";
const API_FREETOGAME = "https://www.freetogame.com/api/games";
const TEMPO_LIMITE_API = 12000;
const STEAM_IMAGENS = "https://cdn.akamai.steamstatic.com/steam/apps";
const TEMPO_TOAST = 3500;

const GENEROS = [
    { valor: "acao", rotulo: "Ação" },
    { valor: "aventura", rotulo: "Aventura" },
    { valor: "rpg", rotulo: "RPG" },
    { valor: "souls-like", rotulo: "Souls-like" },
    { valor: "hack-and-slash", rotulo: "Hack and Slash" },
    { valor: "guerra", rotulo: "Guerra" },
    { valor: "tiro", rotulo: "Tiro" },
    { valor: "estrategia", rotulo: "Estratégia" },
    { valor: "esporte", rotulo: "Esportes e corrida" },
    { valor: "luta", rotulo: "Luta" }
];

const MAPA_GENEROS_FREETOGAME = {
    "shooter": "tiro",
    "battle royale": "tiro",
    "mmorpg": "rpg",
    "arpg": "rpg",
    "fantasy": "rpg",
    "mmo": "aventura",
    "sandbox": "aventura",
    "strategy": "estrategia",
    "card game": "estrategia",
    "moba": "estrategia",
    "sports": "esporte",
    "racing": "esporte",
    "fighting": "luta",
    "mmofps": "tiro",
    "action rpg": "rpg",
    "action": "acao"
};

const CAMINHOS_API = [
    (url) => url,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`
];

const PLATAFORMAS = [
    { valor: "pc", rotulo: "PC" },
    { valor: "playstation", rotulo: "PlayStation" },
    { valor: "xbox", rotulo: "Xbox" },
    { valor: "switch", rotulo: "Nintendo Switch" },
    { valor: "retro", rotulo: "Retro" }
];

const CAMPOS_FORMULARIO = [
    "titulo", "desenvolvedora", "genero", "lancamento",
    "nota", "plataformas", "imagem", "descricao"
];

const JOGOS_INICIAIS = [
    {
        id: "the-witcher-3",
        titulo: "The Witcher 3: Wild Hunt",
        desenvolvedora: "CD Projekt Red",
        genero: "rpg",
        plataformas: ["pc", "playstation", "xbox", "switch"],
        lancamento: "2015-05-19",
        nota: 93,
        imagem: "assets/img/thewitcher3.png",
        descricao: "Um RPG de mundo aberto ambientado em um universo de fantasia e bruxaria. Você controla Geralt de Rívia em uma jornada por um mundo de fantasia."
    },
    {
        id: "minecraft",
        titulo: "Minecraft",
        desenvolvedora: "Mojang Studios",
        genero: "aventura",
        plataformas: ["pc", "playstation", "xbox", "switch"],
        lancamento: "2011-11-18",
        nota: 93,
        imagem: "assets/img/minecraft.png",
        descricao: "Jogo de construção e exploração em um mundo aberto formado por blocos."
    },
    {
        id: "elden-ring",
        titulo: "Elden Ring",
        desenvolvedora: "FromSoftware",
        genero: "souls-like",
        plataformas: ["pc", "playstation", "xbox"],
        lancamento: "2022-02-25",
        nota: 94,
        imagem: "assets/img/eldenring.png",
        descricao: "RPG de ação em um grande mundo de fantasia desenvolvido pela FromSoftware."
    },
    {
        id: "red-dead-redemption-2",
        titulo: "Red Dead Redemption 2",
        desenvolvedora: "Rockstar Games",
        genero: "acao",
        plataformas: ["pc", "playstation", "xbox"],
        lancamento: "2018-10-26",
        nota: 97,
        imagem: "assets/img/reddeadredemption2.png",
        descricao: "Uma história de ação e redenção em um mundo aberto ambientada no Velho Oeste americano."
    },
    {
        id: "god-of-war",
        titulo: "God of War",
        desenvolvedora: "Santa Monica Studio",
        genero: "acao",
        plataformas: ["pc", "playstation"],
        lancamento: "2018-04-20",
        nota: 94,
        imagem: "assets/img/godofwar2018.png",
        descricao: "Aventura de ação que acompanha Kratos e seu filho Atreus em uma jornada pela mitologia nórdica."
    },
    {
        id: "cyberpunk-2077",
        titulo: "Cyberpunk 2077",
        desenvolvedora: "CD Projekt Red",
        genero: "rpg",
        plataformas: ["pc", "playstation", "xbox"],
        lancamento: "2020-12-10",
        nota: 86,
        imagem: "assets/img/cyberpunk2077.png",
        descricao: "RPG de ação ambientado em Night City, uma megalópole futurista."
    }
];

const ui = {
    pesquisa: document.getElementById("pesquisa"),
    filtroGenero: document.getElementById("genero"),
    filtroPlataforma: document.getElementById("plataforma"),
    ordenacao: document.getElementById("ordenacao"),
    quantidade: document.getElementById("quantidade"),
    grid: document.getElementById("grid-jogos"),

    form: document.getElementById("form-jogo"),
    tituloForm: document.getElementById("titulo-formulario"),
    generoForm: document.getElementById("genero-cadastro"),
    opcoesPlataformas: document.getElementById("opcoes-plataformas"),
    botaoSalvar: document.getElementById("botao-salvar"),
    botaoLimpar: document.getElementById("botao-limpar"),

    formApi: document.getElementById("form-busca-api"),
    fonteApi: document.getElementById("fonte-api"),
    termoApi: document.getElementById("termo-api"),
    botaoApi: document.getElementById("botao-busca-api"),
    statusApi: document.getElementById("status-api"),
    resultadosApi: document.getElementById("resultados-api"),

    secaoDetalhes: document.getElementById("detalhes"),
    detCapa: document.getElementById("det-capa"),
    detTitulo: document.getElementById("det-titulo"),
    detNota: document.getElementById("det-nota"),
    detDescricao: document.getElementById("det-descricao"),
    detDesenvolvedora: document.getElementById("det-desenvolvedora"),
    detLancamento: document.getElementById("det-lancamento"),
    detGenero: document.getElementById("det-genero"),
    detPlataformas: document.getElementById("det-plataformas"),
    detEditar: document.getElementById("det-editar"),
    detExcluir: document.getElementById("det-excluir"),
    detArtigo: document.getElementById("det-artigo"),
    detVazio: document.getElementById("det-vazio"),

    dialogoExclusao: document.getElementById("dialogo-exclusao"),
    textoExclusao: document.getElementById("texto-exclusao"),
    toast: document.getElementById("toast")
};

let jogos = carregarJogos();
let idEmEdicao = null;
let idDetalhes = null;
let idParaExcluir = null;
let numeroUltimaBusca = 0;
let cacheFreeToGame = null;
let temporizadorToast = null;

function criarElemento(tag, { classe, texto, atributos } = {}, filhos = []) {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }
    if (texto !== undefined) {
        elemento.textContent = texto;
    }
    if (atributos) {
        for (const [nome, valor] of Object.entries(atributos)) {
            elemento.setAttribute(nome, valor);
        }
    }
    elemento.append(...filhos);

    return elemento;
}

function normalizar(texto) {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function gerarId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatarData(dataIso) {
    if (!dataIso) {
        return "Não informada";
    }
    const [ano, mes, dia] = dataIso.split("-");
    return `${dia}/${mes}/${ano}`;
}

function obterAno(dataIso) {
    return dataIso ? dataIso.slice(0, 4) : "s/d";
}

function obterRotuloGenero(valor) {
    const genero = GENEROS.find((item) => item.valor === valor);
    return genero ? genero.rotulo : "Sem gênero";
}

function obterRotulosPlataformas(valores = []) {
    const rotulos = valores
        .map((valor) => PLATAFORMAS.find((item) => item.valor === valor))
        .filter(Boolean)
        .map((item) => item.rotulo);

    return rotulos.length > 0 ? rotulos.join(", ") : "Não informadas";
}

function imagemValida(valor) {
    if (!valor) {
        return true;
    }
    if (valor.startsWith("assets/")) {
        return true;
    }
    try {
        const url = new URL(valor);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch (erro) {
        return false;
    }
}

function mostrarMensagem(texto, tipo = "sucesso") {
    clearTimeout(temporizadorToast);

    ui.toast.textContent = texto;
    ui.toast.className = `toast toast-${tipo}`;
    ui.toast.hidden = false;

    temporizadorToast = setTimeout(() => {
        ui.toast.hidden = true;
    }, TEMPO_TOAST);
}

function copiarJogosIniciais() {
    return JOGOS_INICIAIS.map((jogo) => ({
        ...jogo,
        plataformas: [...jogo.plataformas]
    }));
}

function salvarJogos() {
    try {
        localStorage.setItem(CHAVE_STORAGE, JSON.stringify(jogos));
        return true;
    } catch (erro) {
        console.error("Não foi possível salvar no localStorage:", erro);
        mostrarMensagem("Não foi possível salvar os dados no navegador.", "erro");
        return false;
    }
}

function carregarJogos() {
    try {
        const salvo = localStorage.getItem(CHAVE_STORAGE);

        if (salvo === null) {
            const iniciais = copiarJogosIniciais();
            localStorage.setItem(CHAVE_STORAGE, JSON.stringify(iniciais));
            return iniciais;
        }

        const dados = JSON.parse(salvo);
        return Array.isArray(dados) ? dados : [];
    } catch (erro) {
        console.error("Não foi possível ler o localStorage:", erro);
        return copiarJogosIniciais();
    }
}

function ordenarJogos(lista, criterio) {
    return lista.sort((a, b) => {
        if (criterio === "lancamento") {
            const diferenca = (b.lancamento || "").localeCompare(a.lancamento || "");
            if (diferenca !== 0) {
                return diferenca;
            }
        }

        if (criterio === "nota") {
            const diferenca = (b.nota ?? -1) - (a.nota ?? -1);
            if (diferenca !== 0) {
                return diferenca;
            }
        }

        return a.titulo.localeCompare(b.titulo, "pt-BR");
    });
}

function obterJogosVisiveis() {
    const termo = normalizar(ui.pesquisa.value.trim());
    const genero = ui.filtroGenero.value;
    const plataforma = ui.filtroPlataforma.value;

    const filtrados = jogos.filter((jogo) => {
        const bateTermo =
            termo === "" ||
            normalizar(jogo.titulo).includes(termo) ||
            normalizar(jogo.desenvolvedora).includes(termo);
        const bateGenero = genero === "" || jogo.genero === genero;
        const batePlataforma =
            plataforma === "" || (jogo.plataformas || []).includes(plataforma);

        return bateTermo && bateGenero && batePlataforma;
    });

    return ordenarJogos(filtrados, ui.ordenacao.value);
}

function criarPlaceholderCapa(titulo) {
    return criarElemento("div", { classe: "capa-vazia", texto: titulo });
}

function criarMidiaCapa(jogo) {
    if (!jogo.imagem) {
        return criarPlaceholderCapa(jogo.titulo);
    }

    const imagem = criarElemento("img", {
        atributos: {
            src: jogo.imagem,
            alt: `Capa do jogo ${jogo.titulo}`,
            loading: "lazy"
        }
    });

    imagem.addEventListener("error", () => {
        if (imagem.src.includes("library_600x900.jpg")) {
            imagem.src = imagem.src.replace("library_600x900.jpg", "header.jpg");
            return;
        }
        imagem.replaceWith(criarPlaceholderCapa(jogo.titulo));
    });

    return imagem;
}

function criarBotaoCard(texto, classe, acao) {
    return criarElemento("button", {
        classe: `botao ${classe}`,
        texto,
        atributos: { type: "button", "data-acao": acao }
    });
}

function criarCard(jogo) {
    const capa = criarElemento("div", { classe: "capa" }, [
        criarMidiaCapa(jogo),
        criarElemento("span", { texto: obterRotuloGenero(jogo.genero) })
    ]);

    const conteudo = criarElemento("div", { classe: "conteudo-card" }, [
        criarElemento("h3", { texto: jogo.titulo }),
        criarElemento("p", {
            classe: "informacao",
            texto: `${jogo.desenvolvedora} · ${obterAno(jogo.lancamento)}`
        }),
        criarElemento("p", { texto: jogo.descricao || "Sem descrição cadastrada." }),
        criarElemento("div", { classe: "card-acoes" }, [
            criarBotaoCard("Ver detalhes", "botao-detalhes", "detalhes"),
            criarBotaoCard("Editar", "botao-editar", "editar"),
            criarBotaoCard("Excluir", "botao-excluir", "excluir")
        ])
    ]);

    const selecionado = jogo.id === idDetalhes;

    return criarElemento(
        "article",
        {
            classe: selecionado ? "card-jogo selecionado" : "card-jogo",
            atributos: { "data-id": jogo.id }
        },
        [capa, conteudo]
    );
}

function renderizarLista() {
    const visiveis = obterJogosVisiveis();

    if (!jogos.some((jogo) => jogo.id === idDetalhes)) {
        const padrao = visiveis[0] || jogos[0];
        definirJogoSelecionado(padrao ? padrao.id : null);
    }

    ui.grid.replaceChildren();

    if (visiveis.length === 0) {
        const mensagem = jogos.length === 0
            ? "Nenhum jogo cadastrado ainda. Use o formulário abaixo para adicionar o primeiro!"
            : "Nenhum jogo encontrado com a pesquisa e os filtros atuais.";

        ui.grid.append(criarElemento("p", { classe: "estado-vazio", texto: mensagem }));
    } else {
        for (const jogo of visiveis) {
            ui.grid.append(criarCard(jogo));
        }
    }

    const total = visiveis.length === jogos.length
        ? `${visiveis.length} ${visiveis.length === 1 ? "jogo" : "jogos"}`
        : `${visiveis.length} de ${jogos.length} jogos`;

    ui.quantidade.textContent = total;
}

function preencherDetalhes(jogo) {
    ui.detCapa.replaceChildren(criarMidiaCapa(jogo));
    ui.detTitulo.textContent = jogo.titulo;
    ui.detNota.textContent = jogo.nota === null || jogo.nota === undefined
        ? "Sem nota no Metacritic"
        : `★ Metacritic: ${jogo.nota} / 100`;
    ui.detDescricao.textContent = jogo.descricao || "Sem descrição cadastrada.";
    ui.detDesenvolvedora.textContent = jogo.desenvolvedora;
    ui.detLancamento.textContent = formatarData(jogo.lancamento);
    ui.detGenero.textContent = obterRotuloGenero(jogo.genero);
    ui.detPlataformas.textContent = obterRotulosPlataformas(jogo.plataformas);
}

function definirJogoSelecionado(id) {
    const jogo = jogos.find((item) => item.id === id);

    idDetalhes = jogo ? jogo.id : null;
    ui.detArtigo.hidden = !jogo;
    ui.detVazio.hidden = Boolean(jogo);

    if (jogo) {
        preencherDetalhes(jogo);
    }

    for (const card of ui.grid.querySelectorAll(".card-jogo")) {
        card.classList.toggle("selecionado", card.dataset.id === idDetalhes);
    }
}

function mostrarDetalhes(id) {
    definirJogoSelecionado(id);
    irPara("detalhes");
}

function lerFormulario() {
    const campos = ui.form.elements;
    const plataformas = [...ui.form.querySelectorAll('input[name="plataformas"]:checked')]
        .map((caixa) => caixa.value);

    return {
        titulo: campos.titulo.value.trim(),
        desenvolvedora: campos.desenvolvedora.value.trim(),
        genero: campos.genero.value,
        lancamento: campos.lancamento.value,
        nota: campos.nota.value.trim(),
        plataformas,
        imagem: campos.imagem.value.trim(),
        descricao: campos.descricao.value.trim()
    };
}

function validarDados(dados) {
    const erros = {};

    if (dados.titulo.length < 2) {
        erros.titulo = "Informe o título do jogo (mínimo de 2 caracteres).";
    } else {
        const duplicado = jogos.some((jogo) =>
            jogo.id !== idEmEdicao &&
            normalizar(jogo.titulo) === normalizar(dados.titulo)
        );
        if (duplicado) {
            erros.titulo = "Já existe um jogo com esse título na biblioteca.";
        }
    }

    if (dados.desenvolvedora.length < 2) {
        erros.desenvolvedora = "Informe a desenvolvedora (mínimo de 2 caracteres).";
    }

    if (dados.genero === "") {
        erros.genero = "Selecione um gênero.";
    }

    if (dados.plataformas.length === 0) {
        erros.plataformas = "Selecione pelo menos uma plataforma.";
    }

    if (dados.nota !== "") {
        const nota = Number(dados.nota);
        if (!Number.isInteger(nota) || nota < 0 || nota > 100) {
            erros.nota = "A nota deve ser um número inteiro entre 0 e 100.";
        }
    }

    if (!imagemValida(dados.imagem)) {
        erros.imagem = "Informe uma URL válida (começando com http:// ou https://).";
    }

    if (dados.descricao.length > 400) {
        erros.descricao = "A descrição deve ter no máximo 400 caracteres.";
    }

    return erros;
}

function obterElementoDoCampo(campo) {
    if (campo === "plataformas") {
        return ui.form.querySelector('input[name="plataformas"]');
    }
    return ui.form.elements[campo];
}

function definirErroCampo(campo, mensagem) {
    const areaErro = ui.form.querySelector(`[data-erro="${campo}"]`);
    const elemento = obterElementoDoCampo(campo);

    if (areaErro) {
        areaErro.textContent = mensagem || "";
    }
    if (elemento) {
        if (mensagem) {
            elemento.setAttribute("aria-invalid", "true");
        } else {
            elemento.removeAttribute("aria-invalid");
        }
    }
}

function mostrarErros(erros) {
    for (const campo of CAMPOS_FORMULARIO) {
        definirErroCampo(campo, erros[campo]);
    }
}

function limparErros() {
    mostrarErros({});
}

function montarJogo(dados, id) {
    return {
        id,
        titulo: dados.titulo,
        desenvolvedora: dados.desenvolvedora,
        genero: dados.genero,
        plataformas: dados.plataformas,
        lancamento: dados.lancamento,
        nota: dados.nota === "" ? null : Number(dados.nota),
        imagem: dados.imagem,
        descricao: dados.descricao
    };
}

function atualizarTextosFormulario() {
    const editando = idEmEdicao !== null;

    ui.tituloForm.textContent = editando ? "Editar jogo" : "Cadastrar um novo jogo";
    ui.botaoSalvar.textContent = editando ? "Salvar alterações" : "Cadastrar jogo";
    ui.botaoLimpar.textContent = editando ? "Cancelar edição" : "Limpar";
}

function sairModoEdicao() {
    idEmEdicao = null;
    atualizarTextosFormulario();
}

function preencherFormulario(jogo) {
    const campos = ui.form.elements;

    campos.titulo.value = jogo.titulo;
    campos.desenvolvedora.value = jogo.desenvolvedora;
    campos.genero.value = jogo.genero;
    campos.lancamento.value = jogo.lancamento || "";
    campos.nota.value = jogo.nota ?? "";
    campos.imagem.value = jogo.imagem || "";
    campos.descricao.value = jogo.descricao || "";

    for (const caixa of ui.form.querySelectorAll('input[name="plataformas"]')) {
        caixa.checked = (jogo.plataformas || []).includes(caixa.value);
    }
}

function irPara(idSecao) {
    document.getElementById(idSecao).scrollIntoView({ behavior: "smooth", block: "start" });
}

function tratarEnvioFormulario(evento) {
    evento.preventDefault();

    const dados = lerFormulario();
    const erros = validarDados(dados);

    mostrarErros(erros);

    const camposComErro = CAMPOS_FORMULARIO.filter((campo) => erros[campo]);
    if (camposComErro.length > 0) {
        obterElementoDoCampo(camposComErro[0]).focus();
        mostrarMensagem("Corrija os campos destacados no formulário.", "erro");
        return;
    }

    const editando = idEmEdicao !== null;

    if (editando) {
        const jogoAtualizado = montarJogo(dados, idEmEdicao);
        jogos = jogos.map((jogo) => (jogo.id === idEmEdicao ? jogoAtualizado : jogo));

        if (idDetalhes === idEmEdicao) {
            preencherDetalhes(jogoAtualizado);
        }
    } else {
        jogos.push(montarJogo(dados, gerarId()));
    }

    salvarJogos();

    ui.form.reset();

    limparFiltros();
    renderizarLista();
    irPara("catalogo");

    mostrarMensagem(
        editando ? "Jogo atualizado com sucesso!" : "Jogo cadastrado com sucesso!"
    );
}

function iniciarEdicao(id) {
    const jogo = jogos.find((item) => item.id === id);
    if (!jogo) {
        return;
    }

    ui.form.reset();
    preencherFormulario(jogo);
    idEmEdicao = id;
    atualizarTextosFormulario();

    irPara("cadastro");
    ui.form.elements.titulo.focus({ preventScroll: true });
    mostrarMensagem(`Editando "${jogo.titulo}".`, "info");
}

function pedirConfirmacaoExclusao(id) {
    const jogo = jogos.find((item) => item.id === id);
    if (!jogo) {
        return;
    }

    idParaExcluir = id;
    ui.textoExclusao.textContent =
        `Tem certeza de que deseja excluir "${jogo.titulo}"? Essa ação não pode ser desfeita.`;
    ui.dialogoExclusao.returnValue = "";
    ui.dialogoExclusao.showModal();
}

function excluirJogo(id) {
    const jogo = jogos.find((item) => item.id === id);
    if (!jogo) {
        return;
    }

    jogos = jogos.filter((item) => item.id !== id);
    salvarJogos();

    if (idEmEdicao === id) {
        ui.form.reset();
    }

    renderizarLista();
    mostrarMensagem(`"${jogo.titulo}" foi excluído.`);
}

function limparFiltros() {
    ui.pesquisa.value = "";
    ui.filtroGenero.value = "";
    ui.filtroPlataforma.value = "";
}

function converterDataUnix(segundos) {
    if (!segundos) {
        return "";
    }
    return new Date(segundos * 1000).toISOString().slice(0, 10);
}

async function buscarJson(url) {
    let ultimoErro = new Error("Nenhum caminho de acesso disponível.");

    for (const montarUrl of CAMINHOS_API) {
        try {
            const opcoes = typeof AbortSignal !== "undefined" && AbortSignal.timeout
                ? { signal: AbortSignal.timeout(TEMPO_LIMITE_API) }
                : {};
            const resposta = await fetch(montarUrl(url), opcoes);

            if (!resposta.ok) {
                throw new Error(`Erro ${resposta.status} ao consultar a API.`);
            }
            return await resposta.json();
        } catch (erro) {
            ultimoErro = erro;
        }
    }

    throw ultimoErro;
}

function mapearGeneroFreeToGame(genero) {
    return MAPA_GENEROS_FREETOGAME[normalizar(genero || "")] || "";
}

function converterJogoFreeToGame(item) {
    const plataforma = normalizar(item.platform || "");

    return {
        titulo: item.title,
        miniatura: item.thumbnail,
        imagem: item.thumbnail,
        nota: null,
        lancamento: item.release_date || "",
        desenvolvedora: item.developer || item.publisher || "",
        descricao: (item.short_description || "").slice(0, 400),
        genero: mapearGeneroFreeToGame(item.genre),
        plataformas: plataforma.includes("windows") ? ["pc"] : [],
        resumo: [
            item.genre,
            `Lançamento: ${formatarData(item.release_date)}`,
            item.developer
        ].filter(Boolean).join(" · ")
    };
}

async function buscarNaFreeToGame(termo) {
    if (cacheFreeToGame === null) {
        const lista = await buscarJson(API_FREETOGAME);

        if (!Array.isArray(lista)) {
            throw new Error("Resposta inesperada da FreeToGame.");
        }
        cacheFreeToGame = lista;
    }

    const termoNormalizado = normalizar(termo);

    return cacheFreeToGame
        .filter((item) => normalizar(item.title).includes(termoNormalizado))
        .slice(0, 20)
        .map(converterJogoFreeToGame);
}

async function buscarNaSteam(termo) {
    const url = `${API_OFERTAS}?storeID=1&pageSize=20&title=${encodeURIComponent(termo)}`;
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(`Erro ${resposta.status} ao consultar a API.`);
    }

    const ofertas = await resposta.json();
    const idsVistos = new Set();
    const resultados = [];

    for (const oferta of ofertas) {
        if (idsVistos.has(oferta.gameID) || !oferta.steamAppID) {
            continue;
        }
        idsVistos.add(oferta.gameID);

        const nota = Number(oferta.metacriticScore);
        const lancamento = converterDataUnix(Number(oferta.releaseDate));

        resultados.push({
            titulo: oferta.title,
            miniatura: oferta.thumb,
            imagem: `${STEAM_IMAGENS}/${oferta.steamAppID}/library_600x900.jpg`,
            nota: nota > 0 ? nota : null,
            lancamento,
            desenvolvedora: "",
            descricao: "",
            genero: "",
            plataformas: ["pc"],
            resumo: [
                `Lançamento: ${formatarData(lancamento)}`,
                nota > 0 ? `Metacritic: ${nota}` : "Sem nota"
            ].join(" · ")
        });
    }

    return resultados;
}

const FONTES_API = {
    freetogame: { nome: "FreeToGame", buscar: buscarNaFreeToGame },
    steam: { nome: "Steam (CheapShark)", buscar: buscarNaSteam }
};

function criarResultadoApi(resultado) {
    const botao = criarElemento("button", {
        classe: "botao botao-detalhes",
        texto: "Usar no cadastro",
        atributos: { type: "button" }
    });
    botao.addEventListener("click", () => usarResultadoApi(resultado));

    return criarElemento("article", { classe: "resultado-api" }, [
        criarElemento("img", {
            atributos: { src: resultado.miniatura, alt: "", loading: "lazy" }
        }),
        criarElemento("div", { classe: "resultado-api-info" }, [
            criarElemento("strong", { texto: resultado.titulo }),
            criarElemento("small", { texto: resultado.resumo }),
            botao
        ])
    ]);
}

function renderizarResultadosApi(resultados) {
    ui.resultadosApi.replaceChildren(...resultados.map(criarResultadoApi));
}

async function tratarBuscaApi(evento) {
    evento.preventDefault();

    const termo = ui.termoApi.value.trim();
    const fonte = FONTES_API[ui.fonteApi.value];

    if (termo.length < 2) {
        ui.statusApi.textContent = "Digite pelo menos 2 caracteres para buscar.";
        ui.resultadosApi.replaceChildren();
        return;
    }

    numeroUltimaBusca += 1;
    const buscaAtual = numeroUltimaBusca;

    ui.botaoApi.disabled = true;
    ui.statusApi.textContent = `Buscando na ${fonte.nome}...`;
    ui.resultadosApi.replaceChildren();

    try {
        const resultados = await fonte.buscar(termo);

        if (buscaAtual !== numeroUltimaBusca) {
            return;
        }

        if (resultados.length === 0) {
            ui.statusApi.textContent = `Nenhum jogo encontrado para "${termo}" na ${fonte.nome}.`;
        } else {
            ui.statusApi.textContent =
                `${resultados.length} resultado(s). Escolha um para preencher o cadastro.`;
            renderizarResultadosApi(resultados);
        }
    } catch (erro) {
        console.error("Falha ao consultar a API:", erro);
        if (buscaAtual === numeroUltimaBusca) {
            ui.statusApi.textContent =
                `Não foi possível consultar a ${fonte.nome} agora. ` +
                "Tente novamente em instantes ou escolha outra fonte.";
        }
    } finally {
        if (buscaAtual === numeroUltimaBusca) {
            ui.botaoApi.disabled = false;
        }
    }
}

function usarResultadoApi(resultado) {
    ui.form.reset();

    const campos = ui.form.elements;
    campos.titulo.value = resultado.titulo;
    campos.desenvolvedora.value = resultado.desenvolvedora;
    campos.genero.value = resultado.genero;
    campos.lancamento.value = resultado.lancamento;
    campos.nota.value = resultado.nota ?? "";
    campos.imagem.value = resultado.imagem;
    campos.descricao.value = resultado.descricao;

    for (const caixa of ui.form.querySelectorAll('input[name="plataformas"]')) {
        caixa.checked = resultado.plataformas.includes(caixa.value);
    }

    const faltando = [];
    if (!resultado.desenvolvedora) {
        faltando.push("desenvolvedora");
    }
    if (!resultado.genero) {
        faltando.push("gênero");
    }
    if (resultado.plataformas.length === 0) {
        faltando.push("plataforma");
    }

    irPara("cadastro");
    const primeiroVazio = !resultado.desenvolvedora ? campos.desenvolvedora : campos.titulo;
    primeiroVazio.focus({ preventScroll: true });

    mostrarMensagem(
        faltando.length > 0
            ? `Dados importados! Complete: ${faltando.join(", ")}.`
            : "Dados importados! Confira e clique em cadastrar.",
        "info"
    );
}

function criarOpcao(valor, rotulo) {
    return criarElemento("option", { texto: rotulo, atributos: { value: valor } });
}

function popularOpcoes() {
    for (const genero of GENEROS) {
        ui.filtroGenero.append(criarOpcao(genero.valor, genero.rotulo));
        ui.generoForm.append(criarOpcao(genero.valor, genero.rotulo));
    }

    for (const plataforma of PLATAFORMAS) {
        ui.filtroPlataforma.append(criarOpcao(plataforma.valor, plataforma.rotulo));

        const caixa = criarElemento("input", {
            atributos: { type: "checkbox", name: "plataformas", value: plataforma.valor }
        });
        ui.opcoesPlataformas.append(
            criarElemento("label", { classe: "opcao-checkbox" }, [caixa, plataforma.rotulo])
        );
    }
}

function registrarEventos() {
    ui.pesquisa.addEventListener("input", renderizarLista);
    ui.filtroGenero.addEventListener("change", renderizarLista);
    ui.filtroPlataforma.addEventListener("change", renderizarLista);
    ui.ordenacao.addEventListener("change", renderizarLista);

    ui.grid.addEventListener("click", (evento) => {
        const botao = evento.target.closest("button[data-acao]");
        if (!botao) {
            return;
        }

        const id = botao.closest("[data-id]").dataset.id;

        if (botao.dataset.acao === "detalhes") {
            mostrarDetalhes(id);
        } else if (botao.dataset.acao === "editar") {
            iniciarEdicao(id);
        } else if (botao.dataset.acao === "excluir") {
            pedirConfirmacaoExclusao(id);
        }
    });

    ui.detEditar.addEventListener("click", () => iniciarEdicao(idDetalhes));
    ui.detExcluir.addEventListener("click", () => pedirConfirmacaoExclusao(idDetalhes));

    ui.form.addEventListener("submit", tratarEnvioFormulario);
    ui.form.addEventListener("reset", () => {
        limparErros();
        sairModoEdicao();
    });
    ui.form.addEventListener("input", (evento) => {
        if (evento.target.name) {
            definirErroCampo(evento.target.name, "");
        }
    });

    ui.dialogoExclusao.addEventListener("close", () => {
        if (ui.dialogoExclusao.returnValue === "confirmar" && idParaExcluir !== null) {
            excluirJogo(idParaExcluir);
        }
        idParaExcluir = null;
    });

    ui.formApi.addEventListener("submit", tratarBuscaApi);
    ui.fonteApi.addEventListener("change", () => {
        numeroUltimaBusca += 1;
        ui.botaoApi.disabled = false;
        ui.statusApi.textContent = "";
        ui.resultadosApi.replaceChildren();
    });
}

function iniciar() {
    popularOpcoes();
    registrarEventos();
    atualizarTextosFormulario();
    renderizarLista();
}

iniciar();