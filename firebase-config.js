// Configuração do Firebase (suas credenciais)
const firebaseConfig = {
  apiKey: "AIzaSyCTaiz67l3lP3bD4XSXWZX1w7-xmK6MPPA",
  authDomain: "fiscaliza-rn.firebaseapp.com",
  projectId: "fiscaliza-rn",
  storageBucket: "fiscaliza-rn.appspot.com",
  messagingSenderId: "46164389845",
  appId: "1:46164389845:web:1d12564e4c182449e9d75c"
};

// Inicialização
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
