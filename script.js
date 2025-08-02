// Elementos garantidos no HTML
const elementos = {
    input: document.getElementById('documento'),
    resultado: document.getElementById('textoResultado'),
    extraido: document.getElementById('textoExtraido')
};

// Palavras para análise
const PALAVRAS_SUSPEITAS = [
    "nepotismo", "fraude", "superfaturado", "falsificado",
    "conluio", "documento alterado", "valor inflado"
];

async function analisarDocumento() {
    // Reset seguro
    elementos.resultado.innerHTML = "Analisando...";
    elementos.extraido.innerHTML = "";

    // Verificação robusta
    if (!elementos.input.files || !elementos.input.files[0]) {
        elementos.resultado.innerHTML = "⚠ Por favor, selecione um arquivo .txt";
        return;
    }

    try {
        const file = elementos.input.files[0];
        
        // Leitura à prova de erros
        const texto = await lerArquivo(file);
        
        // Exibição do conteúdo
        exibirConteudo(texto, file.name);
        
        // Análise detalhada
        const problemas = analisarTexto(texto);
        
        // Resultado final
        exibirResultado(problemas);

    } catch (error) {
        elementos.resultado.innerHTML = `
            <div style="color:red;">
                ⚠ ERRO: ${error.message || "Falha na análise"}
            </div>
            <p>Formato suportado: .txt (UTF-8)</p>
        `;
    }
}

// Funções auxiliares
function lerArquivo(file) {
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

function exibirConteudo(texto, nomeArquivo) {
    elementos.extraido.innerHTML = `
        <h3>Conteúdo (${nomeArquivo})</h3>
        <div class="conteudo-extraido">
            ${texto.length > 1000 ? texto.substring(0, 1000) + '...' : texto}
        </div>
    `;
}

function exibirResultado(problemas) {
    if (problemas.length > 0) {
        elementos.resultado.innerHTML = `
            <div class="erro">
                ❌ ${problemas.length} PROBLEMA(S) ENCONTRADO(S):
            </div>
            <ul>${problemas.map(item => `<li>${item}</li>`).join('')}</ul>
        `;
    } else {
        elementos.resultado.innerHTML = `
            <div class="sucesso">
                ✅ DOCUMENTO VÁLIDO
            </div>
            Nenhuma irregularidade detectada.
        `;
    }
}

function limparAnalise() {
    elementos.input.value = "";
    elementos.resultado.innerHTML = "Nenhum documento analisado ainda.";
    elementos.extraido.innerHTML = "";
}
