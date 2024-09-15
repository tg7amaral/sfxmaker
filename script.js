const canvas1 = document.getElementById('waterCanvas');
const ctx1 = canvas1.getContext('2d');
canvas1.width = canvas1.offsetWidth;
canvas1.height = canvas1.offsetHeight;

const waves = [];
var oldWaves = [];
const waveCount = 20;
const maxOldWaves = 20;
const fadeSpeed = 0.02; // Velocidade de desvanecimento das ondas antigas

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (let i = 0; i < waveCount; i++) {
    waves.push({
        y: (canvas1.height / 2) - 10 + Math.random() * 20, // 中央付近に分布
        length: 0.01 + getRandom(1,1) / 1000,
        amplitude: 0.1 + getRandom(70,75),
        frequency: 0.01 + getRandom(1,3) / 250,
        phase: Math.random() * Math.PI * 2
    });
}

function getRandomCoords(xmin, xmax, ymin, ymax, propNumberx, propNumbery) {
    let randomCoords = {};
    let x = Math.floor(Math.random() * (xmax - xmin + 1)) + xmin;
    let y = Math.floor(Math.random() * (ymax - ymin + 1)) + ymin;
    let propx = xmax / propNumberx;
    let propy = ymax / propNumbery;

    if((x < propx || x > xmax - propx) && (y < propy || y > ymax - propy)){
        randomCoords = getRandomCoords(xmin, xmax, ymin, ymax, propNumberx, propNumbery)
    }else if((x < propx || x > xmax - propx) || (y < propy || y > ymax - propy)){
        randomCoords = getRandom(0,1) === 1
            ? getRandomCoords(xmin, xmax, ymin, ymax, propNumberx, propNumbery)
            : randomCoords = {x: x, y: y};
    }else{
        randomCoords = {x: x, y: y};
    }

    return randomCoords;
}

function animate() {
    requestAnimationFrame(animate);
    ctx1.fillStyle = "#000000";
    ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

    // Desenhar ondas atuais
    waves.forEach((wave, index) => {
      ctx1.beginPath();
      ctx1.moveTo(0, wave.y);
      for (let i = 0; i < canvas1.width; i++) {
          const yOffset = Math.sin(i * wave.length + wave.phase) * wave.amplitude * Math.sin(wave.phase);
          ctx1.lineTo(i, wave.y + yOffset);
      }
      ctx1.strokeStyle = `hsl(${index / 2 + 220}, 100%, 50%)`;
      ctx1.stroke();

      wave.phase += wave.frequency;
  });

    // Desenhar ondas antigas
    oldWaves.forEach((wave, index) => {
        ctx1.beginPath();
        ctx1.moveTo(0, wave.y);
        for (let i = 0; i < canvas1.width; i++) {
            const yOffset = Math.sin(i * wave.length + wave.phase) * wave.amplitude * Math.sin(wave.phase);
            ctx1.lineTo(i, wave.y + yOffset);
        }
        ctx1.strokeStyle = `hsla(${index / 2 + 220}, 100%, ${index % 5 === 1 ? wave.opacity * 100 : wave.opacity * 50}%)`;
        ctx1.stroke();

        // Reduzir a opacidade da onda antiga
        wave.opacity -= fadeSpeed;
    });

    // Remover ondas antigas com opacidade baixa
    oldWaves = oldWaves.filter(wave => wave.opacity > 0);

    // Adicionar novas ondas antigas
    if (oldWaves.length < maxOldWaves) {
        const randomWave = waves[getRandom(0, waves.length - 1)];
        oldWaves.push({
            y: randomWave.y,
            length: randomWave.length,
            amplitude: randomWave.amplitude,
            frequency: randomWave.frequency,
            phase: randomWave.phase,
            opacity: 1 // Começa totalmente visível
        });
    }

    
}

animate();

window.addEventListener('resize', () => {
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    waves.forEach((wave) => {
        wave.y = (canvas1.height / 2) - 100 + Math.random() * 200; // 中央付近に再配置
    });
});


////////////////////////////////////////////////////////////////////////////////////

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["tudo sofre","tudo crê","tudo espera","tudo suporta"];
const typingDelay = 200;
const erasingDelay = 100;
const newTextDelay = 2000; // Delay between current and next text
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

document.addEventListener("DOMContentLoaded", function() { // On DOM Load initiate the effect
  if(textArray.length) setTimeout(type, newTextDelay + 250);
});

//////////////////////////////////////////////////////////////////////////////////////
let playing = false;
function playMusic() {
    const audioElement = document.querySelector("#music");

    audioElement.volume = 0.25;
    audioElement.loop = true;

    if(!playing){
        audioElement.play();

        document.querySelector(".soundPulse").style.animation = "pulse 1.5s ease infinite";
    }else{
        audioElement.pause();

        document.querySelector(".soundPulse").style.animation = "none";
    }

    playing = !playing;
}

function yes(){
    navigator.vibrate([200,100,200]);

    canvas.style.display = "block";

    if (!disabled) {
    disabled = true
    // Loading stage
      setTimeout(() => {
        window.initBurst()
        render()
        setTimeout(() => {
          // Reset button so user can select it again
          disabled = false;

          window.location.href = `instagram://user?username=${encodeURIComponent("tiago.invictus")}`;
        }, 3000)
      }, 300)
  }
}

// quantidade para adicionar em cada pressionar de botão
const confettiCount = 100
const sequinCount = 20

// variáveis de "física"
const gravityConfetti = 0.3
const gravitySequins = 0.55
const dragConfetti = 0.075
const dragSequins = 0.02
const terminalVelocity = 3

var disabled = false
const canvas = document.getElementById('confetti')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let button = document.querySelector(".liquidButton > span")

// adicionar objetos Confetto/Sequin a arrays para desenhá-los
let confetti = []
let sequins = []

// cores, o lado de trás é mais escuro para o efeito de "flip" do confete
const colors = [
  { front: '#0077FF', back: '#0066FF' }, // Azul Claro
  { front: '#0055FF', back: '#0044FF' }, // Azul Médio
  { front: '#0022CC', back: '#0011BB' }  // Azul Escuro
]

// função auxiliar para escolher um número aleatório dentro de um intervalo
randomRange = (min, max) => Math.random() * (max - min) + min

// função auxiliar para obter velocidades iniciais para confetes
// esta distribuição ponderada ajuda os confetes a parecerem mais realistas
initConfettoVelocity = (xRange, yRange) => {
  const x = randomRange(xRange[0], xRange[1])
  const range = yRange[1] - yRange[0] + 1
  let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range)
  if (y >= yRange[1] - 1) {
    // Ocasionalmente um confete vai mais alto que o máximo
    y += (Math.random() < .25) ? randomRange(1, 3) : 0
  }
  return { x: x, y: -y }
}

// Classe Confetto
function Confetto() {
  this.randomModifier = randomRange(0, 99)
  this.color = colors[Math.floor(randomRange(0, colors.length))]
  this.dimensions = {
    x: randomRange(5, 9),
    y: randomRange(8, 15),
  }
  let btncoords = button.getBoundingClientRect();
  this.position = {
    x: randomRange(btncoords.left, btncoords.right),
    y: randomRange(btncoords.top, btncoords.bottom),
  }
  this.rotation = randomRange(0, 2 * Math.PI)
  this.scale = {
    x: 1,
    y: 1,
  }
  this.velocity = initConfettoVelocity([-9, 9], [6, 11])
}
Confetto.prototype.update = function() {
  // aplicar forças à velocidade
  this.velocity.x -= this.velocity.x * dragConfetti
  this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
  this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()
  
  // definir posição
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y

  // girar confete escalando y e definir a cor, 0.09 apenas desacelera a frequência do cosseno
  this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)    
}

// Classe Sequin
function Sequin() {
  this.color = colors[Math.floor(randomRange(0, colors.length))].back;
  this.radius = randomRange(1, 2);
  let btncoords = button.getBoundingClientRect();
  this.position = {
    x: randomRange(btncoords.left, btncoords.right),
    y: randomRange(btncoords.top, btncoords.bottom),
  },
  this.velocity = {
    x: randomRange(-6, 6),
    y: randomRange(-8, -12)
  }
}
Sequin.prototype.update = function() {
  // aplicar forças à velocidade
  this.velocity.x -= this.velocity.x * dragSequins
  this.velocity.y = this.velocity.y + gravitySequins
  
  // definir posição
  this.position.x += this.velocity.x
  this.position.y += this.velocity.y   
}

// adicionar elementos aos arrays para serem desenhados
initBurst = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push(new Confetto())
  }
  for (let i = 0; i < sequinCount; i++) {
    sequins.push(new Sequin())
  }
}

// desenhar os elementos na tela
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  confetti.forEach((confetto, index) => {
    let width = (confetto.dimensions.x * confetto.scale.x)
    let height = (confetto.dimensions.y * confetto.scale.y)
    
    // mover canvas para a posição e girar
    ctx.translate(confetto.position.x, confetto.position.y)
    ctx.rotate(confetto.rotation)

    // atualizar valores de "física" do confete
    confetto.update()
    
    // obter a cor da frente ou de trás
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back
    
    // desenhar confete
    ctx.fillRect(-width / 2, -height / 2, width, height)
    
    // resetar matriz de transformação
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  })

  sequins.forEach((sequin, index) => {  
    // mover canvas para a posição
    ctx.translate(sequin.position.x, sequin.position.y)
    
    // atualizar valores de "física" do sequin
    sequin.update()
    
    // definir a cor
    ctx.fillStyle = sequin.color
    
    // desenhar sequin
    ctx.beginPath()
    ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI)
    ctx.fill()

    // resetar matriz de transformação
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  })

  // remover confetes e sequins que caem fora da tela
  // deve ser feito em loops separados para evitar cintilação perceptível
  confetti.forEach((confetto, index) => {
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1)
  })
  sequins.forEach((sequin, index) => {
    if (sequin.position.y >= canvas.height) sequins.splice(index, 1)
  })

  window.requestAnimationFrame(render)
}

// re-inicializar canvas se o tamanho da janela mudar
resizeCanvas = () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

// ouvinte de redimensionamento
window.addEventListener('resize', () => {
  resizeCanvas()
})