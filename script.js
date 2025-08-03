// Configurações da Análise
const PALAVRAS_SUSPEITAS = [
    "nepotismo", "fraude", "superfaturado", "falsificado",
    "conluio", "documento alterado", "valor inflado", "dispensa ilegal",
    "emergência fictícia", "processo seletivo cancelado", "edital modificado"
];

// Elementos do DOM
const elementos = {
    // Análise individual
    inputIndividual: document.getElementById('documento'),
    resultadoIndividual: document.getElementById('textoResultado'),
    textoExtraido: document.getElementById('textoExtraido'),
    
    // Comparação
    input1: document.getElementById('documento1'),
    input2: document.getElementById('documento2'),
    resultadoComparacao: document.getElementById('resultadoComparacao')
};

// Função principal de análise individual
async function analisarDocumento() {
    elementos.resultadoIndividual.innerHTML = "Analisando...";
    elementos.textoExtraido.innerHTML = "";

    if (!elementos.inputIndividual.files[0]) {
        elementos.resultadoIndividual.innerHTML = "⚠ Por favor, selecione um arquivo.";
        return;
    }

    try {
        const file = elementos.inputIndividual.files[0];
        const texto = await lerArquivo(file);
        
        exibirConteudo(texto, file.name);
        const problemas = analisarTexto(texto);
        exibirResultadoIndividual(problemas);

    } catch (error) {
        elementos.resultadoIndividual.innerHTML = `
            <div class="erro">
                ⚠ ERRO: ${error.message}
            </div>
            <p>Formato suportado: .txt (UTF-8)</p>
        `;
    }
}

// Função para comparação de documentos
async function compararDocumentos() {
    elementos.resultadoComparacao.innerHTML = "Comparando documentos...";

    if (!elementos.input1.files[0] || !elementos.input2.files[0]) {
        elementos.resultadoComparacao.innerHTML = "⚠ Por favor, selecione ambos os documentos.";
        return;
    }

    try {
        const [texto1, texto2] = await Promise.all([
            lerArquivo(elementos.input1.files[0]),
            lerArquivo(elementos.input2.files[0])
        ]);
        
        const resultado = compararTextos(texto1, texto2);
        exibirResultadoComparacao(resultado);

    } catch (error) {
        elementos.resultadoComparacao.innerHTML = `
            <div class="erro">
                ⚠ ERRO: ${error.message}
            </div>
        `;
    }
}

// Funções auxiliares
async function lerArquivo(file) {
    return new Promise((resolve, reject) => {
        if (!file.name.endsWith('.txt')) {
            reject(new Error("Apenas arquivos .txt são suportados"));
            return;
        }

        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => reject(new Error("Falha na leitura do arquivo"));
        reader.readAsText(file);
    });
}

function analisarTexto(texto) {
    const problemas = [];
    const textoLower = texto.toLowerCase();

    // 1. Verifica palavras-chave
    PALAVRAS_SUSPEITAS.forEach(palavra => {
        if (textoLower.includes(palavra)) {
            problemas.push(`Termo proibido: <strong>${palavra}</strong>`);
        }
    });

    // 2. Verifica datas futuras
    const datas = texto.match(/\b\d{2}\/\d{2}\/\d{4}\b/g) || [];
    const hoje = new Date();
    datas.forEach(data => {
        const [dia, mes, ano] = data.split('/');
        const dataDoc = new Date(ano, mes-1, dia);
        if (dataDoc > hoje) problemas.push(`Data futura: <strong>${data}</strong>`);
    });

    return problemas;
}

function compararTextos(texto1, texto2) {
    const lines1 = texto1.split('\n');
    const lines2 = texto2.split('\n');
    const diff = [];
    
    // Identifica diferenças linha por linha
    for (let i = 0; i < Math.max(lines1.length, lines2.length); i++) {
        if (lines1[i] !== lines2[i]) {
            diff.push({
                linha: i + 1,
                original: lines1[i] || '[linha vazia]',
                editado: lines2[i] || '[linha vazia]'
            });
        }
    }
    
    // Sugestão de originalidade
    const score1 = (texto1.match(/revisado|editado|alterado/gi) || []).length;
    const score2 = (texto2.match(/revisado|editado|alterado/gi) || []).length;
    
    let sugestao;
    if (score1 > score2) {
        sugestao = "O segundo documento parece ser o original.";
    } else if (score2 > score1) {
        sugestao = "O primeiro documento parece ser o original.";
    } else {
        sugestao = "Não foi possível determinar qual é o original.";
    }
    
    return {
        diferencas: diff,
        sugestao: sugestao,
        totalDiferencas: diff.length
    };
}

function exibirConteudo(texto, nomeArquivo) {
    elementos.textoExtraido.innerHTML = `
        <h3>Conteúdo do documento (${nomeArquivo})</h3>
        <div class="conteudo-texto">
            ${texto.length > 1000 ? texto.substring(0, 1000) + '...' : texto}
        </div>
    `;
}

function exibirResultadoIndividual(problemas) {
    if (problemas.length > 0) {
        elementos.resultadoIndividual.innerHTML = `
            <div class="erro">
                ❌ ${problemas.length} PROBLEMA(S) ENCONTRADO(S):
            </div>
            <ul>${problemas.map(item => `<li>${item}</li>`).join('')}</ul>
        `;
    } else {
        elementos.resultadoIndividual.innerHTML = `
            <div class="sucesso">
                ✅ DOCUMENTO VÁLIDO
            </div>
            Nenhuma irregularidade detectada.
        `;
    }
}

function exibirResultadoComparacao(resultado) {
    let html = `
        <h3>🔍 Resultado da Comparação</h3>
        <p class="alerta"><strong>${resultado.sugestao}</strong></p>
        <p>Total de diferenças encontradas: <strong>${resultado.totalDiferencas}</strong></p>
    `;

    if (resultado.diferencas.length > 0) {
        html += `<div class="diferencas-container"><h4>Detalhes das diferenças:</h4>`;
        
        resultado.diferencas.forEach(diff => {
            html += `
                <div class="diferenca">
                    <p><strong>Linha ${diff.linha}:</strong></p>
                    <p class="original">Original: ${diff.original}</p>
                    <p class="editado">Editado: ${diff.editado}</p>
                </div>
            `;
        });
        
        html += `</div>`;
    }

    elementos.resultadoComparacao.innerHTML = html;
}

function limparAnalise() {
    elementos.inputIndividual.value = "";
    elementos.resultadoIndividual.innerHTML = "Nenhum documento analisado ainda.";
    elementos.textoExtraido.innerHTML = "";
}
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    // Envie este token para seu backend Python
    const response = await fetch('/api/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    return await response.json();
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
}
