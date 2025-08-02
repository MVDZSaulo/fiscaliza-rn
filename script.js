// Simulação de banco de dados no localStorage
function salvarDenuncia(documento, resultado) {
    const denuncias = JSON.parse(localStorage.getItem('denuncias')) || [];
    const novaDenuncia = {
        id: Date.now(),
        nomeDocumento: documento.name,
        resultado: resultado,
        data: new Date().toLocaleDateString('pt-BR')
    };
    denuncias.push(novaDenuncia);
    localStorage.setItem('denuncias', JSON.stringify(denuncias));
    return novaDenuncia;
}

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

    // Leitura de arquivos de texto simples (.txt)
    if (file.type === "text/plain" || file.name.endsWith('.txt')) {
        texto = await file.text();
    } 
    // Leitura simulada de PDF/DOCX (apenas para demonstração)
    else {
        texto = `[Conteúdo simulado do ${file.name}]\n\nTexto extraído: "Lorem ipsum dolor sit amet..."`;
    }

    // Exibe o texto e simula análise
    textoExtraidoEl.innerHTML = `<strong>Texto identificado:</strong><br><pre>${texto.substring(0, 500)}...</pre>`;
    
    // Simulação de IA (procura por palavras suspeitas)
    const palavrasSuspeitas = ["nepotismo", "fraude", "adulterado"];
    const isFraudulento = palavrasSuspeitas.some(palavra => texto.toLowerCase().includes(palavra));
    
    const resultado = isFraudulento 
        ? "❌ Documento suspeito: termos proibidos detectados." 
        : "✅ Documento válido: nenhum termo suspeito encontrado.";
    
    resultadoEl.innerHTML = resultado;
}
    
    const denuncia = salvarDenuncia(file, resultado);
    document.getElementById('textoResultado').innerHTML = `
        ${resultado}<br>
        <small>ID: ${denuncia.id}</small><br>
        <button onclick="location.reload()">Nova Análise</button>
    `;
}
