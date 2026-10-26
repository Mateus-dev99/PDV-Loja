// Lista de produtos do sistema (simulando um banco de dados)
const produtos = [
    { id: 1, nome: "Arroz 5 kg", preco: 25.90, codigoBarras: "7891000100101" },
    { id: 2, nome: "Feijão 1kg", preco: 8.50, codigoBarras: "7891000100202" },
    { id: 3, nome: "Pão de queijo grande", preco: 7.20, codigoBarras: "789100100303" },
];
console.log(produtos);

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
        html += `<li>${produto.nome} - R$ ${produto.preco.toFixed(2)}</li>`;
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

    // 5. Atualiza a tela
    mostrarCarrinho();
    
}


// ==== Conectar o botão à função ====
botaoBuscar.addEventListener("click", buscarProdutos);
botaoFinalizar.addEventListener("click", finalizarVenda);



