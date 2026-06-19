// Exemplo: URL é ?produto=notebook&preco=2500
const urlParams = new URLSearchParams(window.location.search);
let girlName = urlParams.get('to');
let instagram = urlParams.get('from');

const confettiCount = 100
const sequinCount = 20

// variáveis de "física"
const gravityConfetti = 0.3
const gravitySequins = 0.55
const dragConfetti = 0.075
const dragSequins = 0.02
const terminalVelocity = 3

var disabled = false
var canvas, ctx;
var button;

/* =========================================================================
   ESTADO COMPARTILHADO ENTRE TODAS AS ANIMAÇÕES
   (precisa estar declarado aqui em cima porque todas as funções de "desenho"
   abaixo são chamadas a partir de um único loop, lá no final do arquivo)
   ========================================================================= */

// --- onda de fundo (waterCanvas) ---
let canvas1, ctx1, waves = [];
let waterAlpha = "0.01";
let waterTicks = 0;

// --- confete ---
let confetti = [];
let sequins = [];
let confettiActive = false;

// --- música / letras sincronizadas ---
let musicActive = false;
let audio, audioCtx, analyser, dataArray, bufferLength;
let coverCanvas, cctx;
let lyricsIndex = 0;
let hideTriggered = false;
let lastTreble = 0;
let lastTrebleBeat = 0;

const lyrics = [
  {text:"Se",end:2.3}, {text:"não",end:2.6}, {text:"existe",end:3}, {text:"vida",end:3.3},
  {text:"fora",end:3.5}, {text:"da",end:3.8}, {text:"Terra",end:4.2}, {text:" ",end:4.3},
  {text:"O",end:4.6}, {text:"universo",end:5}, {text:"é",end:5.2}, {text:"desperdício",end:5.5},
  {text:"de",end:5.8}, {text:"espaço",end:6.3}, {text:"Mas",end:6.5}, {text:"as",end:6.8},
  {text:"estrelas",end:7.3}, {text:"apareceram",end:8}, {text:"na",end:8.3}, {text:"minha",end:8.7},
  {text:"frente",end:9.2}, {text:"quando",end:9.6}, {text:"eu",end:10}, {text:"recebi",end:10.4},
  {text:"seu",end:10.7}, {text:"abraço",end:11.2}, {text:"Foi",end:11.5}, {text:"um",end:11.7},
  {text:"tanto",end:12.1}, {text:"quanto",end:12.5}, {text:"muito",end:12.8}, {text:"mágico",end:13.2},
  {text:"entro",end:13.6}, {text:"no",end:13.9}, {text:"buraco",end:14.3}, {text:"negro",end:14.7},
  {text:"só",end:15}, {text:"para",end:15.3}, {text:"voltar",end:15.6}, {text:"e",end:15.8},
  {text:"ver",end:16.1}, {text:"seu",end:16.4}, {text:"sorriso",end:16.8}, {text:"lá",end:17.1},
  {text:"no",end:17.3}, {text:"passado",end:17.7}, {text:"fazendo",end:18.25}, {text:"minha",end:18.6},
  {text:"mente",end:19}, {text:"flutuar",end:20}, {text:"Mas",end:20.4}, {text:"sei",end:20.8},
  {text:"lá",end:21.2}, {text:"se",end:21.6}, {text:"existe",end:22}, {text:"vida",end:22.4},
  {text:"fora",end:22.8}, {text:"da",end:23.1}, {text:"Terra",end:23.5}, {text:"disso",end:23.8},
  {text:"eu",end:24.2}, {text:"não",end:24.6}, {text:"sei",end:25.3},
];

// --- oceano 3D (definidas mais abaixo, junto com o resto do efeito) ---
let c, postctx, ocean, vertices = [];
let vertexCount = 7000
let vertexSize = 3
let oceanWidth = 150
let oceanHeight = -80
let gridSize = 32;
let waveSize = 32;
let perspective = 100;
let depth = (vertexCount / oceanWidth * gridSize)
let oceanFrame = 0
let oldTimeStamp = performance.now();
let { sin, cos, tan, PI } = Math

function renderPage(letterIndex){
  switch(letterIndex){
    case 0:{
      document.body.innerHTML += `
      <header>
        <img src="heart.svg" class="heartPulse">
        <img src="heart.svg" class="heart">
        <button>Para <span class="titleLabel">${girlName}</span></button>

        <audio id="music" src="musicVibe.mp3" style="display:none"></audio>
      </header>

      <section id="cover">
        <button class="openInvite">Clique para abrir o convite</button>
      </section>
      <button class="author">@${instagram}</button>

      <canvas id="waterCanvas"></canvas>
      <h1 class="titleCanvas">${girlName}, aceita sair comigo?</h1>

      <canvas id="oceanCanvas"></canvas>

      <p id="mainText">Só existe um convite desse no mundo. Não existe mais nenhum, para nenhuma outra pessoa</p>

      <canvas id="confetti"></canvas>

      <section class="mainButtonsContainer">
        <section class="buttonsContainer">
          <button class="liquidButton" onclick="yes()">
            <span>Sim</span>
            <div class="liquid"/></div>
          </button>
          <button class="negativeButton" onclick="decline()">
            <span><s>Não</s></span>
          </button>
          <div class="liquidButtonShadow"></div>
        </section>
      </section>`;

      document.querySelector("#cover").addEventListener("click",function(event){
        document.querySelector("#cover").innerHTML = "";
        initMusic();
      })

      canvas1 = document.getElementById('waterCanvas');
      ctx1 = canvas1.getContext('2d');
      canvas1.width = canvas1.offsetWidth;
      canvas1.height = canvas1.offsetHeight;

      const waveCount = 30;

      function getRandom(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      waves = [];
      for (let i = 0; i < waveCount; i++) {
          waves.push({
              y: (canvas1.height / 2),
              length: 0.015,
              amplitude: (canvas1.height / 3),
              frequency: getRandom(10,20) / 1000,
              phase: Math.PI * 2
          });
        }

      window.addEventListener('resize', () => {
          canvas1.width = window.innerWidth;
          canvas1.height = window.innerHeight;
          waves.forEach((wave) => {
             wave.y = (canvas1.height / 2);
             wave.amplitude = (canvas1.height / 3);
          });
      });

      ////////////////////////////////////////////////////////////////////////////////////

      const typedTextSpan = document.querySelector(".typed-text");
      const cursorSpan = document.querySelector(".cursor");

      const textArray = ["tudo sofre","tudo crê","tudo espera","tudo suporta"];
      const typingDelay = 200;
      const erasingDelay = 100;
      const newTextDelay = 2000;
      let textArrayIndex = 0;
      let charIndex = 0;

      function type() {
        if (charIndex < textArray[textArrayIndex].length) {
          if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
          typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
          charIndex++;
          setTimeout(type, typingDelay);
        }
        else {
          cursorSpan.classList.remove("typing");
          setTimeout(erase, newTextDelay);
        }
      }

      function erase() {
        if (charIndex > 0) {
          if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
          typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
          charIndex--;
          setTimeout(erase, erasingDelay);
        }
        else {
          cursorSpan.classList.remove("typing");
          textArrayIndex++;
          if(textArrayIndex>=textArray.length) textArrayIndex=0;
          setTimeout(type, typingDelay + 1100);
        }
      }

      document.addEventListener("DOMContentLoaded", function() {
        if(textArray.length) setTimeout(type, newTextDelay + 250);
      });

      canvas = document.getElementById('confetti')
      ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      button = document.querySelector(".liquidButton > span")

    }
  }
}

// =========================================================================
// DESENHO DA ÁGUA (antiga função animate())
// =========================================================================
function drawWater() {
  if (!ctx1) return;

  waterTicks++;
  if (waterTicks >= 500) {
    waterAlpha = waterAlpha === "0.01" ? "0.05" : "0.01";
    waterTicks = 0;
  }

  ctx1.fillStyle = `rgb(0,0,0,${waterAlpha})`;
  ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

  waves.forEach((wave, i) => {
    ctx1.beginPath();
    ctx1.moveTo(0, wave.y);
    for (let x = 0; x < canvas1.width; x++) {
        const yOffset = Math.sin(x * wave.length + wave.phase) * wave.amplitude * Math.sin(wave.phase);
        ctx1.lineTo(x, wave.y + yOffset);
    }
    ctx1.strokeStyle = `hsl(${i / 2 + 220}, 100%, 50%)`;
    ctx1.stroke();
    wave.phase += wave.frequency;
  });
}

const colors = [
  { front: '#0077FF', back: '#0066FF' },
  { front: '#0055FF', back: '#0044FF' },
  { front: '#0022CC', back: '#0011BB' },
  { front: '#FFFFFF', back: '#AAAAAA' }
];

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfettoVelocity = (xRange, yRange) => {
  const x = randomRange(xRange[0], xRange[1]);
  const range = yRange[1] - yRange[0] + 1;
  let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
  if (y >= yRange[1] - 1) {
    y += (Math.random() < .25) ? randomRange(1, 3) : 0;
  }
  return { x: x, y: -y };
};

function Confetto() {
  this.randomModifier = randomRange(0, 99);
  this.color = colors[Math.floor(randomRange(0, colors.length))];
  this.dimensions = {
    x: randomRange(5, 9),
    y: randomRange(8, 15),
  };
  let btncoords = button.getBoundingClientRect();
  this.position = {
    x: randomRange(btncoords.left, btncoords.right),
    y: randomRange(btncoords.top, btncoords.bottom),
  };
  this.rotation = randomRange(0, 2 * Math.PI);
  this.scale = {
    x: 1,
    y: 1,
  };
  this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
}
Confetto.prototype.update = function() {
  this.velocity.x -= this.velocity.x * dragConfetti;
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
};

function Sequin() {
  this.color = colors[Math.floor(randomRange(0, colors.length))].back;
  this.radius = randomRange(1, 2);
  let btncoords = button.getBoundingClientRect();
  this.position = {
    x: randomRange(btncoords.left, btncoords.right),
    y: randomRange(btncoords.top, btncoords.bottom),
  };
  this.velocity = {
    x: randomRange(-6, 6),
    y: randomRange(-8, -12)
  };
}
Sequin.prototype.update = function() {
  this.velocity.x -= this.velocity.x * dragSequins;
  this.velocity.y = this.velocity.y + gravitySequins;
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
};

initBurst = () => {
  confetti = [];
  sequins = [];

  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetto());
  }
  for (let i = 0; i < sequinCount; i++) {
    sequins.push(new Sequin());
  }
};

// =========================================================================
// DESENHO DO CONFETE (antiga função render())
// =========================================================================
function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto) => {
    let width = (confetto.dimensions.x * confetto.scale.x);
    let height = (confetto.dimensions.y * confetto.scale.y);
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);
    confetto.update();
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  sequins.forEach((sequin) => {
    ctx.translate(sequin.position.x, sequin.position.y);
    sequin.update();
    ctx.fillStyle = sequin.color;
    ctx.beginPath();
    ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  // remove o que já saiu da tela (usando filter em vez de splice durante o forEach,
  // que era um bug sutil no código original)
  confetti = confetti.filter((c) => c.position.y < canvas.height);
  sequins = sequins.filter((s) => s.position.y < canvas.height);

  // economiza processamento quando não sobrou nada para desenhar
  if (confetti.length === 0 && sequins.length === 0) {
    confettiActive = false;
  }
}

function yes(){
  if (!disabled) {
  disabled = true
  // Loading stage
    setTimeout(() => {
      window.initBurst()
      confettiActive = true
      navigator.vibrate([100,50,100,200,1000]);
      setTimeout(() => {
        // Reset button so user can select it again
        disabled = false;

        window.location.href = `instagram://user?username=${encodeURIComponent(instagram)}`;
      }, 3000)
    }, 300)
}
}

function decline(){
      navigator.vibrate([100,100,100]);
}

function getLetterParam(){
  const urlParams = new URLSearchParams(window.location.search);
  let letter = urlParams.get("letter");

  letter = letter ? parseInt(letter, 10) : 0;
  return isNaN(letter) ? 0 : letter;
}

const letter = getLetterParam();
renderPage(letter);


function hideCover(){
  let opacity = 1;
      let interval = setInterval(function(){
        opacity -= 0.2;
        document.querySelector("#cover").style.opacity = opacity;

        if(opacity <= 0){
          document.querySelector("#cover").remove();
          clearInterval(interval);
        }
      },100)
}

function initMusic() {
    audio = document.querySelector("#music");

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;

    const source = audioCtx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);

    coverCanvas = document.createElement("canvas");
    coverCanvas.id = "coverCanvas";
    coverCanvas.width = window.innerWidth;
    coverCanvas.height = window.innerHeight;
    document.querySelector("#cover").appendChild(coverCanvas);

    cctx = coverCanvas.getContext("2d");

    cctx.imageSmoothingEnabled = false;
    cctx.webkitImageSmoothingEnabled = false; // Safari/Chrome antigo
    cctx.mozImageSmoothingEnabled = false;    // Firefox antigo
    cctx.msImageSmoothingEnabled = false;     // IE11

    cctx.font = "bold 60px monospace";

    // Buffer para análise de frequência
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    audio.addEventListener("play", () => {
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
        hideCover();
        musicActive = true; // libera o desenho das letras no loop principal
    });
    audio.play();

    audio.addEventListener("ended", () => {
      audio.src = "musicVibe.mp3"; // Define o novo áudio
      audio.loop = true; // Faz o segundo tocar em loop
      audio.play(); // Toca automaticamente
      audio.volume = 0.3; // Volume
    });
}

function detectTrebleBeat() {
    analyser.getByteFrequencyData(dataArray);

    // pega agudos reais (não só o final do espectro)
    let start = Math.floor(bufferLength * 0.30);
    let end = Math.floor(bufferLength * 0.75);

    let sum = 0;

    for (let i = start; i < end; i++) {
        sum += dataArray[i];
    }

    let treble = sum / (end - start);

    // suaviza para evitar ruído
    let smooth = (treble * 0.6) + (lastTreble * 0.4);

    // detecta subida rápida
    let diff = smooth - lastTreble;

    if (diff > 0.5) {
        let now = Date.now();

        if (now - lastTrebleBeat > 80) {
            navigator.vibrate(25);
            lastTrebleBeat = now;
        }
    }

    lastTreble = smooth;
}

// =========================================================================
// DESENHO DAS LETRAS DA MÚSICA (antiga função drawLyrics())
// =========================================================================
function drawLyrics() {
    detectTrebleBeat();

    cctx.clearRect(0, 0, coverCanvas.width, coverCanvas.height);

    let currentTime = audio.currentTime;

    cctx.textAlign = "center";
    cctx.textBaseline = "middle";
    cctx.fillStyle = "#FFFFFF";

    if(currentTime >= 2 && lyrics[lyricsIndex] != undefined){
      cctx.fillText(lyrics[lyricsIndex].text, window.innerWidth/2, window.innerHeight/2);
    }
    if(lyrics[lyricsIndex] != undefined && currentTime >= lyrics[lyricsIndex].end){
      lyricsIndex++;
    }

    if(currentTime >= 57 && !hideTriggered){
      hideTriggered = true
      hideCover()
      musicActive = false; // letra acabou, não precisa mais ser desenhada
    }
}

/////////////////////

/**
 * 3D Software ocean effect with Canvas2D
 * You can change properties no início do arquivo, na seção "ESTADO COMPARTILHADO"
 */

c = document.createElement('canvas').getContext('2d')
postctx = document.querySelector("#oceanCanvas").getContext('2d')
ocean = c.canvas

// Generating dots
for (let i = 0; i < vertexCount; i++) {
	let x = i % oceanWidth
  let y = 0
  let z = i / oceanWidth >> 0
	let offset = oceanWidth / 2
	vertices.push([(-offset + x) * gridSize, y * gridSize, z * gridSize])
}

// =========================================================================
// DESENHO DO OCEANO 3D (antiga função loop())
// =========================================================================
function drawOcean(timeStamp) {
	let rad = sin(oceanFrame / 100) * PI / 20
  let rad2 = sin(oceanFrame / 50) * PI / 10
  const dt = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

	oceanFrame += dt * 50;
	if (postctx.canvas.width !== postctx.canvas.offsetWidth || postctx.canvas.height !== postctx.canvas.offsetHeight) {
  	postctx.canvas.width = ocean.width = postctx.canvas.offsetWidth
    postctx.canvas.height = ocean.height = postctx.canvas.offsetHeight
  }


	c.fillStyle = `hsl(200deg, 100%, 0%)`
  c.fillRect(0, 0, ocean.width, ocean.height)
  c.save()
  c.translate(ocean.width / 2, ocean.height / 2)

  c.beginPath()
  vertices.forEach((vertex, i) => {
  	let ni = i + oceanWidth
  	let x = vertex[0] - oceanFrame % (gridSize * 2)
    let z = vertex[2] - oceanFrame * 2 % gridSize + (i % 2 === 0 ? gridSize / 2 : 0)
  	let wave = (cos(oceanFrame / 45 + x / 50) - sin(oceanFrame / 20 + z / 50) + sin(oceanFrame / 30 + z*x / 10000))
    let y = vertex[1] + wave * waveSize
    let a = Math.max(0, 1 - (Math.sqrt(x ** 2 + z ** 2)) / depth)
    let tx, ty, tz

    y -= oceanHeight

    tx = x
    ty = y
    tz = z

    // Rotation Y
    tx = x * cos(rad) + z * sin(rad)
    tz = -x * sin(rad) + z * cos(rad)

    x = tx
    y = ty
    z = tz

    // Rotation Z
    tx = x * cos(rad) - y * sin(rad)
    ty = x * sin(rad) + y * cos(rad)

    x = tx;
    y = ty;
    z = tz;

    // Rotation X
    ty = y * cos(rad2) - z * sin(rad2)
    tz = y * sin(rad2) + z * cos(rad2)

    x = tx;
    y = ty;
    z = tz;

    x /= z / perspective
    y /= z / perspective


    if (a < 0.01) return
    if (z < 0) return


    c.globalAlpha = a
    c.fillStyle = `hsla(${220 + wave * 5}deg, 100%, 50%,50%)`
    c.fillRect(x - a * vertexSize / 2, y - a * vertexSize / 2, a * vertexSize, a * vertexSize)
    c.globalAlpha = 1
  })
  c.restore()

  // Post-processing
  postctx.drawImage(ocean, 0, 0)

  postctx.globalCompositeOperation = "screen"
  postctx.filter = 'blur(16px)'
  postctx.drawImage(ocean, 0, 0)
  postctx.filter = 'blur(0)'
  postctx.globalCompositeOperation = "source-over"
}

// =========================================================================
// LOOP PRINCIPAL ÚNICO — substitui os 4 requestAnimationFrame separados
// (água, oceano, confete e letras da música)
// =========================================================================
function masterLoop(timestamp) {
  requestAnimationFrame(masterLoop);

  drawWater();
  drawOcean(timestamp);

  if (confettiActive) drawConfetti();
  if (musicActive) drawLyrics();
}

requestAnimationFrame(masterLoop);