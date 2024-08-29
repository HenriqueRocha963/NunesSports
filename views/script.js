document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProduto');
    const tabelaProdutos = document.querySelector('#tabelaProdutos tbody');
    const resetBtn = document.getElementById('reset');
    let editingId = null;


   
    // Função para carregar a lista de produtos salvos
    function carregarsalvos() {
        fetch('/api/produtos')
            .then(response => response.json())
            .then(data => {
                tabelaProdutos.innerHTML = '';
                data.forEach(produto => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td id="diftd">${produto.nome}</td>
                        <td id="diftd">${produto.quantidade}</td>
                        <td>R$${produto.valorCompra.toFixed(2)}</td>
                        <td>R$${produto.valorVenda.toFixed(2)}</td>
                        <td>R$${(produto.valorCompra*produto.quantidade).toFixed(2)}</td>
                        <td>R$${(produto.valorVenda*produto.quantidade).toFixed(2)}</td>
                        <td id="diftd2">R$${((produto.valorVenda-produto.valorCompra)*produto.quantidade).toFixed(2)}</td>
                        <td>
                            <button class="edit salvar" data-id="${produto.id}">Editar</button>
                            <button class="delete salvar" id="reset" data-id="${produto.id}">Excluir</button>
                        </td>
                    `;
                    tabelaProdutos.appendChild(tr);
                });
            });
    }

    // Função para salvar produto
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.getElementById('nome').value;
        const quantidade = document.getElementById('quantidade').value;
        const valorCompra = document.getElementById('valorCompra').value;
        const valorVenda = document.getElementById('valorVenda').value;

        const produto = { nome, quantidade, valorCompra, valorVenda };

        if (editingId) {
            fetch(`/api/produtos/${editingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            }).then(() => {
                carregarsalvos();
                resetBtn.click();
                editingId = null;
            });
        } else {
            fetch('/api/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(produto)
            }).then(() => {
                carregarsalvos();
                resetBtn.click();
            });
        }
    });

    // Função para editar produto
    tabelaProdutos.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit')) { console.log("deudeudeu");
            const id = e.target.getAttribute('data-id');
            fetch(`/api/produtos/${id}`)
                .then(response => response.json())
                .then(produto => {
                    document.getElementById('nome').value = produto.nome;
                    document.getElementById('quantidade').value = produto.quantidade;
                    document.getElementById('valorCompra').value = produto.valorCompra;
                    document.getElementById('valorVenda').value = produto.valorVenda;
                    editingId = id;
                });
        }

        // Função para excluir produto
        if (e.target.classList.contains('delete')) {
            const id = e.target.getAttribute('data-id');
            fetch(`/api/produtos/${id}`, {
                method: 'DELETE'
            }).then(() => {
                carregarsalvos();
            });
        }
    });

    carregarsalvos();
});