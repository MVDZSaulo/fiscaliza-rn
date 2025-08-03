import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  addDoc,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBx-Y8qRzds70GYvlJK9rifeHTzKFNG1Ss",
  authDomain: "fiscalizarn-b4e81.firebaseapp.com",
  projectId: "fiscalizarn-b4e81",
  storageBucket: "fiscalizarn-b4e81.appspot.com",
  messagingSenderId: "486825833189",
  appId: "1:486825833189:web:057a8cba57182431d19a0c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Cria usuário admin padrão (executa ao carregar)
async function criarAdminPadrao() {
  const emailAdmin = "admin@fiscalizarn.com";
  const senhaAdmin = "Admin@1234";
  const codigoAdmin = "ADMIN-2023";

  try {
    // Verifica se o admin já existe
    signInWithEmailAndPassword(auth, emailAdmin, senhaAdmin)
      .catch(async (error) => {
        if (error.code === "auth/user-not-found") {
          const userCred = await createUserWithEmailAndPassword(auth, emailAdmin, senhaAdmin);
          await setDoc(doc(db, "usuarios", userCred.user.uid), {
            nome: "Administrador",
            email: emailAdmin,
            role: "admin",
            criadoEm: new Date()
          });
          console.log("✅ Admin criado com sucesso");
          auth.signOut(); // Desconecta após criação
        }
      });
  } catch (error) {
    console.error("Erro ao criar admin:", error);
  }
}

// Chama a função ao carregar
criarAdminPadrao();

// Controle de formulários
document.getElementById('showRegister').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
});

// Cadastro
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
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
  }
});

// Login
document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('msgLogin');
  msg.textContent = '';
  msg.className = 'msg';

  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    showSuccess(msg, 'Login efetuado! Redirecionando...');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);

  } catch (error) {
    handleAuthError(error, msg);
  }
});

// Funções auxiliares
function showError(element, message) {
  element.textContent = `❌ ${message}`;
  element.classList.add('erro');
}

function showSuccess(element, message) {
  element.textContent = `✅ ${message}`;
  element.classList.add('sucesso');
}

function handleAuthError(error, element) {
  const messages = {
    'auth/email-already-in-use': 'E-mail já cadastrado',
    'auth/invalid-email': 'E-mail inválido',
    'auth/weak-password': 'Senha muito fraca',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'default': `Erro: ${error.message}`
  };
  showError(element, messages[error.code] || messages['default']);
}
