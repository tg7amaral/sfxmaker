function drawVisualization(analyser, dataArray) {
    const canvas = document.querySelector("#musicCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const bufferLength = analyser.fftSize;
    const smoothingFactor = 0.3; // Fator de suavização
    const smoothDataArray = new Float32Array(bufferLength); // Array para suavização

    // Array para armazenar os círculos
    const circles = [];

    function draw() {
        requestAnimationFrame(draw);

        // Captura os dados do domínio do tempo
        analyser.getByteTimeDomainData(dataArray);

        // Suaviza os dados
        for (let i = 0; i < bufferLength; i++) {
            smoothDataArray[i] =
                smoothDataArray[i] * smoothingFactor +
                (dataArray[i] / 128.0 - 1) * (1 - smoothingFactor);
        }

        // Limpa o canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = circles.length - 1; i >= 0; i--) {
            const circle = circles[i];

            // Atualiza a posição do círculo
            circle.x += circle.speedX;
            circle.y += circle.speedY;
            circle.alpha -= circle.fade; // Decrementa a opacidade mais rapidamente

            // Garante que o círculo permaneça dentro dos limites do canvas
            if (circle.x - circle.radius < 0 || circle.x + circle.radius > canvas.width || 
                circle.y - circle.radius < 0 || circle.y + circle.radius > canvas.height) {
                circles.splice(i, 1); // Remove se sair do canvas
                continue; // Não desenha
            }

            // Desenha o círculo com sombra branca
            ctx.shadowColor = `rgba(${circle.color[0]}, ${circle.color[1]}, ${circle.color[2]}, 0.5)`; // Cor da sombra
            ctx.shadowBlur = 10; // Desfoque da sombra
            ctx.shadowOffsetX = 0; // Sem deslocamento
            ctx.shadowOffsetY = 0; // Sem deslocamento

            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = `rgba(${circle.color[0]}, ${circle.color[1]}, ${circle.color[2]}, ${circle.alpha})`; // Branco com opacidade
            ctx.fill();

            // Remove círculos que desapareceram
            if (circle.alpha <= 0) {
                circles.splice(i, 1);
            }
        }

        // Configura o estilo de desenho da linha
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(255, 0, 53)'; // Cor da onda

        ctx.shadowColor = 'rgba(255, 0, 53, 0.5)'; // Cor da sombra
            ctx.shadowBlur = 10; // Desfoque da sombra
            ctx.shadowOffsetX = 0; // Sem deslocamento
            ctx.shadowOffsetY = 0; // Sem deslocamento

        // Inicia o desenho da linha
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        // Variável para armazenar a intensidade do grave
        let bassIntensity = 0;

        for (let i = 0; i < bufferLength; i++) {
            const y = (smoothDataArray[i] * canvas.height) / 4 + canvas.height / 2;

            // Para a detecção de graves (frequências baixas)
            if (i < 8) { // Analisando as primeiras frequências (0-200 Hz)
                bassIntensity += dataArray[i];
            }

            if (i === 0) {
                ctx.moveTo(x, y); // Começa o desenho
            } else {
                ctx.lineTo(x, y); // Desenha uma linha até o próximo ponto
            }

            x += sliceWidth; // Incrementa a posição horizontal
        }

        ctx.stroke(); // Finaliza o desenho da linha

        // Efeito para graves fortes
        if (bassIntensity / 8 > 170) { // Aumentando o limite para detectar graves
            // Adiciona um novo círculo
            const circle = {
                x: canvas.width / 2 + (Math.random() * canvas.width - canvas.width / 2), // Posição aleatória na largura
                y: (smoothDataArray[0] * canvas.height) / 4 + canvas.height / 2, // Y igual ao Y da onda
                radius: Math.random() * 5 + 2, // Raio entre 2 e 5 (círculos menores)
                alpha: 1, // Opacidade inicial
                speedX: (Math.random() - 0.5) * 1 * (bassIntensity / 256), // Velocidade em X, proporcional à intensidade do grave
                speedY: (Math.random() - 0.5) * 1, // Velocidade em Y, constante
                color:[255,255,255],fade:0.025
            };
            circles.push(circle);
            navigator.vibrate([100]);
        }else if (bassIntensity / 8 > 70 && bassIntensity / 8 < 170) { // Aumentando o limite para detectar graves
            // Adiciona um novo círculo
            const circle = {
                x: canvas.width / 2 + (Math.random() * canvas.width - canvas.width / 2), // Posição aleatória na largura
                y: (smoothDataArray[0] * canvas.height) / 4 + canvas.height / 2, // Y igual ao Y da onda
                radius: Math.random() * 2 + 2, // Raio entre 2 e 5 (círculos menores)
                alpha: 1, // Opacidade inicial
                speedX: (Math.random() - 0.5) * 5, // Velocidade em X, proporcional à intensidade do grave
                speedY: (Math.random() - 0.5) * 5, // Velocidade em Y, constante
                color:[255,0,53],fade:0.1
            };
            circles.push(circle);
        }
    }

    draw(); // Inicia a animação
}

// Inicializa o AudioContext e sincroniza a visualização
function initMusic() {
    const audio = document.querySelector("#music");

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048; // Ajuste para uma resolução maior

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    drawVisualization(analyser, dataArray);

    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    audio.play();
}