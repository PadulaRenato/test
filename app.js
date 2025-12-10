// Verificar se está logado
const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'));

if (!loggedUser) {
    window.location.href = 'index.html';
}

// Exibir email do usuário
document.getElementById('userEmail').textContent = loggedUser.email;

// Produtos padrão
const defaultProducts = [
    {
        nome: 'Bola de Futebol',
        codigo: 'L001',
        tipo: 'Loja',
        categoria: 'Bola',
        preco: 100.00
    }
];

// Inicializar produtos no localStorage se não existir
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
}

// Função para carregar produtos
function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const tableBody = document.getElementById('productTableBody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nome}</td>
            <td>${product.codigo}</td>
            <td>${product.tipo || '-'}</td>
            <td>${product.categoria || '-'}</td>
            <td>R$ ${parseFloat(product.preco).toFixed(2)}</td>
            <td><button class="btn-delete" onclick="deleteProduct(${index})">Excluir</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Mostrar formulário apenas para Admin
if (loggedUser.role === 'admin') {
    document.getElementById('productForm').style.display = 'block';

    // Processar cadastro de produto
    document.getElementById('formCadastro').addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const codigo = document.getElementById('codigo').value;
        const preco = document.getElementById('preco').value;
        const tipo = document.getElementById('tipo').value;
        const categoria = document.getElementById('categoria').value;
        const message = document.getElementById('form-message');

        // Validar preço
        if (parseFloat(preco) <= 0) {
            message.textContent = 'Erro: O preço deve ser maior que zero!';
            message.className = 'form-message error';
            message.style.display = 'block';
            return;
        }

        // Validar código único
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const codigoExists = products.some(p => p.codigo.toLowerCase() === codigo.toLowerCase());

        if (codigoExists) {
            message.textContent = 'Erro: Código já cadastrado!';
            message.className = 'form-message error';
            message.style.display = 'block';
            return;
        }

        // Adicionar produto
        const newProduct = {
            nome,
            codigo,
            tipo,
            categoria,
            preco: parseFloat(preco)
        };

        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));

        // Limpar formulário
        document.getElementById('formCadastro').reset();

        // Mostrar mensagem de sucesso
        message.textContent = 'Produto cadastrado com sucesso!';
        message.className = 'form-message';
        message.style.display = 'block';

        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);

        // Recarregar tabela
        loadProducts();
    });
}

// Função para excluir produto
function deleteProduct(index) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }
}

// Função de logout
function logout() {
    sessionStorage.removeItem('loggedUser');
    window.location.href = 'index.html';
}

// Carregar produtos ao iniciar
loadProducts();
