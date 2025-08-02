// URL do arquivo JSON (substitua SEU_USUARIO pelo seu nome de usuário no GitHub)
const DB_URL = 'https://raw.githubusercontent.com/SEU_USUARIO/fiscaliza-rn/main/db/denuncias.json';

// Função para salvar denúncias (simulado)
async function salvarDenuncia(documento, resultado) {
    const novaDenuncia = {
        id: Date.now(),
        nomeDocumento: documento.name,
        resultado: resultado,
        data: new Date().toLocaleDateString('pt-BR')
    };

    // Fallback: Salva no localStorage
    const denuncias = JSON.parse(localStorage.getItem('denuncias') || [];
    denuncias.push(novaDenuncia);
    localStorage.setItem('denuncias', JSON.stringify(denuncias));

    console.log("Denúncia salva (localStorage):", novaDenuncia);
    return novaDenuncia;
}

// Função para analisar documentos
async function analisarDocumento() {
    const fileInput = document.getElementById('documento');
    const resultadoEl = document.getElementById('textoResultado');
    
    if (!fileInput.files[0]) {
        resultadoEl.textContent = "Por favor, selecione um arquivo.";
        return;
    }

    const file = fileInput.files[0];
    const isFraudulento = Math.random() > 0.5; // Simulação de IA
    const resultado = isFraudulento ? 
        "❌ Documento suspeito: Assinatura inconsistente." : 
        "✅ Documento válido: Nenhuma irregularidade.";

    const denuncia = await salvarDenuncia(file, resultado);
    resultadoEl.innerHTML = `
        ${resultado}<br><br>
        <strong>Nº da Denúncia:</strong> ${denuncia.id}<br>
        <button onclick="location.reload()">Nova Análise</button>
    `;
}
