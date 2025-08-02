function analisarDocumento() {
    const fileInput = document.getElementById('documento');
    const resultado = document.getElementById('textoResultado');
    
    if (!fileInput.files[0]) {
        resultado.textContent = "Por favor, selecione um arquivo antes de analisar.";
        return;
    }

    const file = fileInput.files[0];
    const isFraudulento = Math.random() > 0.5; // Simulação aleatória para o protótipo

    if (isFraudulento) {
        resultado.innerHTML = `
            ❌ <strong>Documento suspeito detectado!</strong><br>
            Motivos: <br>
            - Assinatura inconsistente<br>
            - Data modificada<br>
            <button onclick="location.reload()" aria-label="Analisar outro documento">Nova Análise</button>
        `;
    } else {
        resultado.innerHTML = `
            ✅ <strong>Documento válido!</strong><br>
            Nenhuma irregularidade encontrada.<br>
            <button onclick="location.reload()" aria-label="Analisar outro documento">Nova Análise</button>
        `;
    }
}
