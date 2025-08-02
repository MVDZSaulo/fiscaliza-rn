// Configurações da Análise
const PALAVRAS_SUSPEITAS = [
    "nepotismo", "fraude", "superfaturado", "falsificado",
    "conluio", "documento alterado", "valor inflado"
];

// Função para ler arquivos de texto
function lerArquivoTexto(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        
        if (file.name.endsWith('.txt')) {
            reader.readAsText(file);
        } else {
            reject(new Error("Formato não suportado. Use arquivos .txt"));
        }
    });
}

// Função Principal
async function analisarDocumento() {
    const fileInput = document.getElementById('documento');
    const resultadoEl = document.getElementById('textoResultado');
    const textoExtraidoEl = document.getElementById('textoExtraido');
    
    // Reset
    resultadoEl.innerHTML = "";
    textoExtraidoEl.innerHTML = "";

    if (!fileInput.files[0]) {
        resultadoEl.textContent = "Por favor, selecione um arquivo .txt";
        return;
    }

    const file = fileInput.files[0];
    
    try {
        // Leitura do arquivo
        const texto = await lerArquivoTexto(file);
        
        // Exibe o conteúdo (limitado a 1000 caracteres)
        textoExtraidoEl.innerHTML = `
            <strong>Conteúdo do arquivo:</strong>
            <div style="max-height:200px; overflow-y:auto; border:1px solid #ddd; padding:10px; margin:10px 0;">
                ${texto.length > 1000 ? texto.substring(0, 1000) + '...' : texto}
            </div>
        `;

        // Análise do Texto
        const problemas = [];
        const textoLower = texto.toLowerCase();

        // Verifica palavras suspeitas
        PALAVRAS_SUSPEITAS.forEach(palavra => {
            if (textoLower.includes(palavra)) {
                problemas.push(`Termo proibido: <strong>${palavra}</strong>`);
            }
        });

        // Verifica datas futuras
        const datas = texto.match(/\d{2}\/\d{2}\/\d{4}/g) || [];
        const hoje = new Date();
        datas.forEach(data => {
            const [dia, mes, ano] = data.split('/');
            const dataDoc = new Date(ano, mes-1, dia);
            if (dataDoc > hoje) {
                problemas.push(`Data futura: <strong>${data}</strong>`);
            }
        });

        // Exibe Resultado
        if (problemas.length > 0) {
            resultadoEl.innerHTML = `
                <div style="color:red; font-weight:bold;">
                    ❌ DOCUMENTO SUSPEITO - ${problemas.length} PROBLEMAS DETECTADOS:
                </div>
                <ul>${problemas.map(item => `<li>${item}</li>`).join('')}</ul>
            `;
        } else {
            resultadoEl.innerHTML = `
                <div style="color:green; font-weight:bold;">
                    ✅ DOCUMENTO VÁLIDO
                </div>
                Nenhuma irregularidade encontrada.
            `;
        }

    } catch (error) {
        resultadoEl.innerHTML = `
            <div style="color:orange; font-weight:bold;">
                ⚠ ERRO: ${error.message}
            </div>
            <p>Dica: Use apenas arquivos .txt</p>
        `;
    }
}

// Função para limpar
function limparAnalise() {
    document.getElementById('documento').value = "";
    document.getElementById('textoResultado').innerHTML = "";
    document.getElementById('textoExtraido').innerHTML = "";
}
