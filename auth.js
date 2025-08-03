import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBx-Y8qRzds70GYvlJK9rifeHTzKFNG1Ss",
  authDomain: "fiscalizarn-b4e81.firebaseapp.com",
  projectId: "fiscalizarn-b4e81",
  storageBucket: "fiscalizarn-b4e81.appspot.com",
  messagingSenderId: "486825833189",
  appId: "1:486825833189:web:057a8cba57182431d19a0c"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 1. Verifica e cria admin padrão se necessário
async function verificarAdmin() {
  const adminEmail = "admin@fiscalizarn.com";
  const adminSenha = "Admin@1234";
  
  try {
    // Tenta fazer login para verificar se existe
    await signInWithEmailAndPassword(auth, adminEmail, adminSenha);
    console.log("Admin já existe");
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, adminEmail, adminSenha);
        await setDoc(doc(db, "usuarios", userCred.user.uid), {
          nome: "Administrador",
          email: adminEmail,
          role: "admin",
          criadoEm: new Date()
        });
        console.log("Admin criado com sucesso");
      } catch (createError) {
        console.error("Erro ao criar admin:", createError);
      }
    }
  } finally {
    // Garante que não permaneça logado após verificação
    await auth.signOut();
  }
}

// Executa ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
  verificarAdmin();
  
  // Controle de formulários
  document.getElementById('showRegister')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
  });

  document.getElementById('showLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  });

  // Cadastro
  document.getElementById('formCadastro')?.addEventListener('submit', handleCadastro);

  // Login
  document.getElementById('formLogin')?.addEventListener('submit', handleLogin);
});

// 2. Função de cadastro
async function handleCadastro(e) {
  e.preventDefault();
  const msg = document.getElementById('msgCadastro');
  msg.textContent = '';
  msg.className = 'msg';

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('emailCadastro').value.trim();
  const senha = document.getElementById('senhaCadastro').value;
  const codigo = document.getElementById('codigoConvite').value.trim();

  if (senha.length < 6) {
    showError(msg, 'Senha deve ter no mínimo 6 caracteres');
    return;
  }

  showLoading(true);

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, senha);
    
    await setDoc(doc(db, "usuarios", userCred.user.uid), {
      nome: nome,
      email: email,
      role: codigo === "ADMIN-2023" ? "admin" : "user",
      criadoEm: new Date()
    });

    showSuccess(msg, 'Cadastro realizado! Faça login.');
    document.getElementById('formCadastro').reset();
    
    setTimeout(() => {
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
    }, 2000);

  } catch (error) {
    handleAuthError(error, msg);
  } finally {
    showLoading(false);
  }
}

// 3. Função de login
async function handleLogin(e) {
  e.preventDefault();
  const msg = document.getElementById('msgLogin');
  msg.textContent = '';
  msg.className = 'msg';

  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;

  showLoading(true);

  try {
    const userCred = await signInWithEmailAndPassword(auth, email, senha);
    
    // Verifica se existe no Firestore
    const userDoc = await getDoc(doc(db, "usuarios", userCred.user.uid));
    
    if (!userDoc.exists()) {
      await auth.signOut();
      throw new Error("Usuário não registrado no sistema");
    }

    showSuccess(msg, 'Login efetuado! Redirecionando...');
    
    setTimeout(() => {
      window.location.href = 'dashboard.html'; // Altere para sua página principal
    }, 1500);

  } catch (error) {
    handleAuthError(error, msg);
  } finally {
    showLoading(false);
  }
}

// Funções auxiliares
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = show ? 'flex' : 'none';
}

function showError(element, message) {
  element.textContent = `❌ ${message}`;
  element.classList.add('erro');
}

function showSuccess(element, message) {
  element.textContent = `✅ ${message}`;
  element.classList.add('sucesso');
}

function handleAuthError(error, element) {
  const errorMap = {
    'auth/invalid-email': 'E-mail inválido',
    'auth/user-disabled': 'Conta desativada',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/email-already-in-use': 'E-mail já cadastrado',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca (mínimo 6 caracteres)',
    'default': `Erro: ${error.message || 'Falha na autenticação'}`
  };
  
  showError(element, errorMap[error.code] || errorMap['default']);
}
