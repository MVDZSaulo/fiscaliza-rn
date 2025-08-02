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

function analisarDocumento() {
    const file = document.getElementById('documento').files[0];
    if (!file) return alert("Selecione um arquivo!");
    
    const isFraudulento = Math.random() > 0.5;
    const resultado = isFraudulento ? 
        "❌ Documento suspeito detectado!" : 
        "✅ Documento válido!";
    
    const denuncia = salvarDenuncia(file, resultado);
    document.getElementById('textoResultado').innerHTML = `
        ${resultado}<br>
        <small>ID: ${denuncia.id}</small><br>
        <button onclick="location.reload()">Nova Análise</button>
    `;
}
