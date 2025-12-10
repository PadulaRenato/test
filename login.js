// Usuários válidos
const users = [
    { email: 'admin@vntsports.com', password: 'Admin123', role: 'admin' },
    { email: 'user@vntsports.com', password: 'User123', role: 'user' }
];

// Verificar se já está logado
if (sessionStorage.getItem('loggedUser')) {
    window.location.href = 'home.html';
}

// Processar login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    
    // Buscar usuário
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Salvar usuário na sessão
        sessionStorage.setItem('loggedUser', JSON.stringify({
            email: user.email,
            role: user.role
        }));
        
        // Redirecionar para home
        window.location.href = 'home.html';
    } else {
        errorMessage.textContent = 'Email ou senha inválidos!';
        errorMessage.style.display = 'block';
    }
});
