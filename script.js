// Configurações da Análise
const PALAVRAS_SUSPEITAS = [
    "nepotismo", "fraude", "superfaturado", "falsificado",
    "conluio", "documento alterado", "valor inflado", "lei inexistente",
    "artigo adulterado", "cláusula fraudulenta", "proposta irregular"
];

const TERMOS_INVALIDOS = [
    "contrato sem licitação", "dispensa ilegal", "emergência fictícia",
    "processo seletivo cancelado", "edital modificado"
];

// Função Principal
async function analisarDocumento() {
    const fileInput = document.getElementById('documento');
    const resultadoEl = document.getElementById('textoResultado');
    const textoExtraidoEl = document.getElementById('textoExtraido');
    
    if (!fileInput.files[0]) {
        resultadoEl.textContent = "Por favor, selecione um arquivo.";
        return;
    }

    const file = fileInput.files[0];
    let texto = "";

    try {
        // Leitura do arquivo
        if (file.type === "text/plain" || file.name.endsWith('.txt')) {
            texto = await file.text();
        } else if (file.name.endsWith('.pdf')) {
            texto = "[Conteúdo de PDF simulado] Para análise real, integre com API como PDF.js";
        } else if (file.name.endsWith('.docx')) {
            texto = "[Conteúdo de DOCX simulado] Use mammoth.js para extração real";
        } else {
            throw new Error("Formato não suportado");
        }

        // Exibe o texto (limitado a 500 caracteres)
        textoExtraidoEl.innerHTML = `
            <strong>Conteúdo extraído:</strong>
            <div style="max-height:200px; overflow-y:auto; border:1px solid #ddd; padding:10px; margin:10px 0;">
                ${texto.length > 500 ? texto.substring(0, 500) + '...' : texto}
            </div>
        `;

        // Análise do Texto
        const problemas = [];

        // 1. Verifica palavras suspeitas
        PALAVRAS_SUSPEITAS.forEach(palavra => {
            if (texto.toLowerCase().includes(palavra)) {
                problemas.push(`Termo proibido: <strong>${palavra}</strong>`);
            }
        });

        // 2. Verifica termos inválidos
        TERMOS_INVALIDOS.forEach(termo => {
            if (texto.toLowerCase().includes(termo.toLowerCase())) {
                problemas.push(`Termo inválido: <strong>${termo}</strong>`);
            }
        });

        // 3. Verifica datas futuras
        const datas = texto.match(/\d{2}\/\d{2}\/\d{4}/g) || [];
        const hoje = new Date();
        datas.forEach(data => {
            const [dia, mes, ano] = data.split('/');
            const dataDoc = new Date(ano, mes-1, dia);
            if (dataDoc > hoje) {
                problemas.push(`Data futura: <strong>${data}</strong>`);
            }
        });

        // 4. Verifica CPFs/CNPJs inválidos (simplificado)
        const cpfs = texto.match(/\d{3}\.\d{3}\.\d{3}-\d{2}/g) || [];
        if (cpfs.length > 5) { // Exemplo: Muitos CPFs podem ser sinal de lista irregular
            problemas.push(`Quantidade suspeita de CPFs: <strong>${cpfs.length}</strong>`);
        }

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
                ⚠ ERRO NA ANÁLISE
            </div>
            ${error.message || "Formato de arquivo não suportado."}
        `;
        console.error(error);
    }
}

// Função para limpar o formulário
function limparAnalise() {
    document.getElementById('documento').value = "";
    document.getElementById('textoResultado').innerHTML = "";
    document.getElementById('textoExtraido').innerHTML = "";
}
