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
                        <td id="diftd">PC${produto.id}</td>
                        <td id="diftd"><input id="editnome${produto.id}" type="text" value="${produto.nome}" disabled></td>
                        <td id="diftd"><input id="editqnt${produto.id}" type="number" value="${produto.quantidade}" disabled></td>
                        <td><input id="editvc${produto.id}" type="number" value="${produto.valorCompra.toFixed(2)}" disabled></td>
                        <td><input id="editvv${produto.id}" type="number" value="${produto.valorVenda.toFixed(2)}" disabled></td>
                        <td>R$${(produto.valorCompra*produto.quantidade).toFixed(2)}</td>
                        <td>R$${(produto.valorVenda*produto.quantidade).toFixed(2)}</td>
                        <td id="diftd2">R$${((produto.valorVenda-produto.valorCompra)*produto.quantidade).toFixed(2)}</td>
                        <td class="teste">
                            <div class="edicaogamb">
                                <button class="edit salvar" onclick="fecharEdicao(${produto.id});editarProduto(${produto.id})" data-id="${produto.id}">Salvar</button>
                                <button class="aux salvar" id="aux${produto.id}" onclick="liberarEdicao(${produto.id})">Editar</button>
                            </div>
                            <div>
                                <button class="delete salvar" id="reset" data-id="${produto.id}">Excluir</button>
                            </div>
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

    
    

    tabelaProdutos.addEventListener('click', (e) => {
        

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