// Carrega denúncias do localStorage
function carregarHistorico() {
    const denuncias = JSON.parse(localStorage.getItem('denuncias')) || [];
    const tabela = document.getElementById('tabelaDenuncias');

    denuncias.forEach(denuncia => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${denuncia.id}</td>
            <td>${denuncia.nomeDocumento}</td>
            <td>${denuncia.resultado}</td>
            <td>${denuncia.data}</td>
        `;
        tabela.appendChild(tr);
    });
}

carregarHistorico();
