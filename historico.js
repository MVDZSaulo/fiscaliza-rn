function carregarHistorico() {
    const denuncias = JSON.parse(localStorage.getItem('denuncias')) || [];
    const tabela = document.getElementById('tabelaDenuncias');
    tabela.innerHTML = denuncias.map(denuncia => `
        <tr>
            <td>${denuncia.id}</td>
            <td>${denuncia.nomeDocumento}</td>
            <td>${denuncia.resultado}</td>
            <td>${denuncia.data}</td>
        </tr>
    `).join('');
}
carregarHistorico();
