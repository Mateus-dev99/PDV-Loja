// ==== Banco de Dados SQL (SQLite no navegador) ====
let db;
let produtos = []; // Vai receber os dados do SQL

async function iniciarBancoDeDados() {
    // Inicia o SQLite
    const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`

    });
    db = new SQL.Database();

    // Comando SQL para criar a tabela de produtos
    const sqlCreate = `
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY,
            nome TEXT,
            preco REAL,
            codigoBarras TEXT
        );
   `;
   db.run(sqlCreate);

   // Comando SQL para criar a tabela de vendas
   const sqlCreateVendas = `
        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_hora TEXT,
            total REAL
        );
    `;
   
   // Comando SQL para inserir dados iniciais
    const sqlInsert = `
        INSERT INTO produtos (id, nome, preco, codigoBarras) VALUES
        (1, 'Arroz 5 kg', 25.90, '7891000100101'),
        (2, 'Feijão 1kg', 8.50, '7891000100202'),
        (3, 'Pão de queijo grande', 7.20, '789100100303');
    `;
    db.run(sqlInsert);

    // Consulta SQL para buscar os dados e colocar no array do sistema
    const res = db.exec("SELECT * FROM produtos");

    if (res.length > 0) {
        // O SQLite devolve os dados em formato de colunas. Vamos formatar pro nosso sistema.
        const colunas = res[0].columns;
        const valores = res[0].values;
        
        produtos = valores.map(linha => {
            return {
                id: linha[0],
                nome: linha[1],
                preco: linha[2],
                codigoBarras: linha[3]
            };
        });
        console.log("Banco SQL carregado com sucesso!", produtos);
    }   
}

// Chama a função assim que o sistema abre
iniciarBancoDeDados();

// Carrinho de compras (começa vazio)
const carrinho = [];

// ==== Capturando os elementos da página ====

const campoBusca = document.getElementById("busca");
const botaoBuscar = document.querySelector("#produtos button");
const resultadoBusca = document.getElementById("resultado-busca");
const botaoFinalizar = document.querySelector("#carrinho button");

console.log(campoBusca);
console.log(botaoBuscar);
console.log(resultadoBusca);

// ==== Função que faz a busca ====

function buscarProdutos() {
    // 1. Pega o texto digitado e deixa tudo minúsculo
    const termo = campoBusca.value.toLowerCase().trim();

    //2. Se o campo estiver vazio, avisa e para
    if (termo ==="") {
        resultadoBusca.innerHTML = "<p>Digite algo para buscar.</p>";
        return;
    }


// 3. Filtra os produtos que contêm o termo no nome ou no código

const encontrados = produtos.filter(function (produto) {
    return (
        produto.nome.toLowerCase().includes(termo) ||
        produto.codigoBarras.includes(termo)
    );
});

// 4. Mostra o resultado na tela

mostrarResultado(encontrados);
}

// ==== Função que mostra o resultado na tela ====
function mostrarResultado(lista) {
    // Se ninguém foi encontrado
    if (lista.length === 0) {
        resultadoBusca.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }


// Monta o HTML com cada produto encontrado
let html = "<ul>";
lista.forEach(function (produto) {
    html += `<li>
    ${produto.nome} - R$ ${produto.preco.toFixed(2)}
    <button onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
</li>`;
});
html += "</ul>";

resultadoBusca.innerHTML = html;
}

//  ==== Adicionar produto ao carrinho ====
function adicionarAoCarrinho(id) {
    const produto = produtos.find(function (p) {
        return p.id === id;
    });
    
    if (!produto) return;

    carrinho.push(produto);
    mostrarCarrinho();
    localStorage.setItem("meuCarrinho", JSON.stringify(carrinho)); // <-- ADICIONE AQUI
}

// ==== Remover produtos do carrinho ====
function removerDoCarrinho(id) {
    // Encontra a posição (índice) do produto no array do carrinho
    const indice = carrinho.findIndex(function (p) {
        return p.id === id;
    });

    // Se achou o produto (índice maior ou igual a 0)
    if (indice >= 0) {
        carrinho.splice(indice, 1); // Remove 1 item a partir daquela posição
        mostrarCarrinho(); // Atualiza a tela
        localStorage.setItem("meuCarrinho", JSON.stringify(carrinho)); // <-- ADICIONE AQUI
    }
}

// ==== Mostrar o carrinho na tela ====
function mostrarCarrinho() {
    const divItens = document.getElementById("itens-carrinho");
    const spanTotal = document.getElementById("total");

    if (carrinho.length === 0) {
        divItens.innerHTML = "<p>Nenhum produto adicionado.</p>";
        spanTotal.textContent = "R$ 0,00";
        return;
    }

    let html = "<ul>";
    carrinho.forEach(function (produto) {
        html += `<li>
            ${produto.nome} - R$ ${produto.preco.toFixed(2)}
            <button onclick="removerDoCarrinho(${produto.id})">Remover</button>
        </li>`;
    });
    html += "</ul>";

    divItens.innerHTML = html;

    const total = carrinho.reduce(function (soma, produto) {
        return soma + produto.preco;
    }, 0);

    spanTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// ==== Finalizar a venda ====
function finalizarVenda() {
    // 1. Verifica se o carrinho está vazio
    if (carrinho.length === 0) {
        alert("O carrinho está vazio. Adicione produtos antes de finalizar.");
        return; // Para a função aqui
    }
    
    // 2. Calcula o total
    const total = carrinho.reduce(function (soma, produto) {
        return soma + produto.preco;
    }, 0);

    // 3. Mostra a mensagem de sucesso
    alert(`Venda finalizada com sucesso!\nTotal: R$ ${total.toFixed(2)}`);

    // 4. Limpa o carrinho
    carrinho.length = 0; // 0 length = 0 apaga tudo que tem dentro do array!
    localStorage.setItem("meuCarrinho", JSON.stringify(carrinho)); // <-- ADICIONE AQUI

    // 5. Atualiza a tela
    mostrarCarrinho();
    
}


// ==== Conectar o botão à função ====
botaoBuscar.addEventListener("click", buscarProdutos);
botaoFinalizar.addEventListener("click", finalizarVenda);

// ==== Acessibilidade: Buscar ao apertar Enter ====
campoBusca.addEventListener("keypress", function(evento) {
    if (evento.key === "Enter") {
        buscarProdutos();
    }
});

// ==== Carregar carrinho salvo ====
const carrinhoSalvo = localStorage.getItem("meuCarrinho");

if (carrinhoSalvo) {
    carrinho.push(...JSON.parse(carrinhoSalvo));
    mostrarCarrinho();
}

// ==== API de Clima (Open-Meteo) ====
function buscarClima() {
    const spanClima = document.getElementById("info-clima");

    // Coordenadas de São Paulo (Latitude, Longitude)
    const lat = -23.55;
    const lon = -46.63;
    
    // URL da API (pedindo temperatura atual)
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    // O fetch vai na internet buscar os dados
    fetch(url)
        .then(function (resposta) {
            return resposta.json(); // Transforma a resposta em objeto JS
        })
        .then(function (dados) {
            // Pega a temperatura que veio da API
            const temperatura = dados.current_weather.temperature;
            spanClima.textContent = `Clima em SP: ${temperatura}°C`;
        })
        .catch(function (erro) {
            spanClima.textContent = "Clima indisponível";
            console.log("Erro ao buscar clima:", erro);
        });
        
}
// Chama a funcção assim que o sistema carrega
buscarClima();