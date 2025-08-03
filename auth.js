import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBx-Y8qRzds70GYvlJK9rifeHTzKFNG1Ss",
  authDomain: "fiscalizarn-b4e81.firebaseapp.com",
  projectId: "fiscalizarn-b4e81",
  storageBucket: "fiscalizarn-b4e81.firebasestorage.app",
  messagingSenderId: "486825833189",
  appId: "1:486825833189:web:057a8cba57182431d19a0c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Alternar entre formulários
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
const formCadastro = document.getElementById('formCadastro');
const msgCadastro = document.getElementById('msgCadastro');

formCadastro.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgCadastro.textContent = '';
  msgCadastro.className = 'msg';

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('emailCadastro').value.trim();
  const senha = document.getElementById('senhaCadastro').value;

  if (senha.length < 6) {
    msgCadastro.textContent = 'Senha deve ter no mínimo 6 caracteres.';
    msgCadastro.classList.add('erro');
    return;
  }

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, senha);
    await addDoc(collection(db, "usuarios"), {
      uid: userCred.user.uid,
      nome: nome,
      email: email
    });
    msgCadastro.textContent = "✅ Cadastro realizado com sucesso!";
    msgCadastro.classList.add('sucesso');
    formCadastro.reset();
    
    // Mostra o formulário de login após cadastro
    setTimeout(() => {
      document.getElementById('registerForm').style.display = 'none';
      document.getElementById('loginForm').style.display = 'block';
      msgCadastro.textContent = '';
    }, 2000);
  } catch (error) {
    msgCadastro.textContent = "❌ Erro: " + error.message;
    msgCadastro.classList.add('erro');
  }
});

// Login
const formLogin = document.getElementById('formLogin');
const msgLogin = document.getElementById('msgLogin');

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  msgLogin.textContent = '';
  msgLogin.className = 'msg';

  const email = document.getElementById('emailLogin').value.trim();
  const senha = document.getElementById('senhaLogin').value;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    msgLogin.textContent = "✅ Login efetuado com sucesso! Redirecionando...";
    msgLogin.classList.add('sucesso');
    formLogin.reset();

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (error) {
    msgLogin.textContent = "❌ E-mail ou senha inválidos.";
    msgLogin.classList.add('erro');
  }

});
