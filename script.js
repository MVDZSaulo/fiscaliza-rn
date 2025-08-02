// Configurações da Análise
const PALAVRAS_SUSPEITAS = [
    "nepotismo", "fraude", "superfaturado", "falsificado",
    "conluio", "documento alterado", "valor inflado"
];

// Função Principal
async function analisarDocumento() {
    const fileInput = document.getElementById('documento');
    const resultadoEl = document.getElementById('textoResultado');
    const textoExtraidoEl = document.getElementById('textoExtraido');
    
    // Reset
    resultadoEl.innerHTML = "Analisando...";
    textoExtraidoEl.innerHTML = "";

    if (!fileInput.files[0]) {
        resultadoEl.textContent = "Por favor, selecione um arquivo.";
        return;
    }

    const file = fileInput.files[0];
    
    try {
        // Leitura do arquivo (método universal)
        const texto = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(new Error("Falha na leitura"));
            reader.readAsText(file);
        });

        // Exibe o conteúdo (limitado)
        textoExtraidoEl.innerHTML = `
            <strong>Conteúdo do arquivo (${file.name}):</strong>
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

        // Verifica datas futuras (formato DD/MM/YYYY)
        const datas = texto.match(/\b\d{2}\/\d{2}\/\d{4}\b/g) || [];
        const hoje = new Date();
        datas.forEach(data => {
            const [dia, mes, ano] = data.split('/');
            const dataDoc = new Date(ano, mes-1, dia);
            if (dataDoc > hoje) {
                problemas.push(`Data futura: <strong>${data}</strong>`);
            }
        });

        // Resultado
        if (problemas.length > 0) {
            resultadoEl.innerHTML = `
                <div style="color:red; font-weight:bold;">
                    ❌ PROBLEMAS ENCONTRADOS (${problemas.length})
                </div>
                <ul>${problemas.map(item => `<li>${item}</li>`).join('')}</ul>
            `;
        } else {
            resultadoEl.innerHTML = `
                <div style="color:green; font-weight:bold;">
                    ✅ DOCUMENTO VÁLIDO
                </div>
                Nenhum termo suspeito encontrado.
            `;
        }

    } catch (error) {
        resultadoEl.innerHTML = `
            <div style="color:orange; font-weight:bold;">
                ⚠ ERRO NA ANÁLISE
            </div>
            <p>${error.message}</p>
            <p>Formato suportado: .txt (UTF-8)</p>
        `;
    }
}

// Função para limpar
function limparAnalise() {
    document.getElementById('documento').value = "";
    document.getElementById('textoResultado').innerHTML = "";
    document.getElementById('textoExtraido').innerHTML = "";
}
