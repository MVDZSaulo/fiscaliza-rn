// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função de Login Integrada
async function fazerLogin(email, senha) {
    try {
        // 1. Faz login com Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, senha);
        
        // 2. Exibe mensagem de sucesso
        document.getElementById('msgLogin').innerHTML = `
            <div class="sucesso">✅ Login realizado com sucesso! Redirecionando...</div>
        `;
        
        // 3. Redireciona após 1 segundo
        setTimeout(() => {
            window.location.href = 'analise.html'; // Página de análise de documentos
        }, 1000);
        
    } catch (error) {
        // Tratamento de erros
        let mensagemErro;
        switch(error.code) {
            case 'auth/invalid-email':
                mensagemErro = "E-mail inválido";
                break;
            case 'auth/user-disabled':
                mensagemErro = "Usuário desativado";
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                mensagemErro = "E-mail ou senha incorretos";
                break;
            default:
                mensagemErro = "Erro ao fazer login";
        }
        
        document.getElementById('msgLogin').innerHTML = `
            <div class="erro">❌ ${mensagemErro}</div>
        `;
    }
}

// Vincula o formulário de login
document.getElementById('formLogin')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const senha = document.getElementById('senhaLogin').value;
    fazerLogin(email, senha);
});

// Verifica se o usuário já está logado
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Se já estiver logado, redireciona diretamente
        window.location.href = 'analise.html';
    }
});
