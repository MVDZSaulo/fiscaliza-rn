document.getElementById('lerPagina').addEventListener('click', () => {
    const elementos = document.querySelectorAll('[tabindex="0"]');
    let textoTotal = '';
    
    elementos.forEach(el => {
        textoTotal += el.textContent + '. ';
    });

    // Usa a API de síntese de voz do navegador
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textoTotal);
        utterance.lang = 'pt-BR';
        speechSynthesis.speak(utterance);
    } else {
        alert("Seu navegador não suporta leitura de tela. Use Chrome ou Edge.");
    }
});
