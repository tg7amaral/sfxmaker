const confettiCount = 100
    const sequinCount = 20

    // variáveis de "física"
    const gravityConfetti = 0.3
    const gravitySequins = 0.55
    const dragConfetti = 0.075
    const dragSequins = 0.02
    const terminalVelocity = 3

    var disabled = false
    var canvas,ctx;
    var button;

function renderPage(letterIndex){
  switch(letterIndex){
    case 0:{
      document.body.innerHTML += `
      <header>
        <img src="heart.svg" class="heartPulse">
        <img src="heart.svg" class="heart">
        <button>À <span class="titleLabel">Anna Júlia</span></button>

        <audio id="music" src="music.mp3" style="display:none"></audio>
      </header>

      <canvas id="waterCanvas"></canvas>
      <h1 class="titleCanvas">Você aceita sair comigo?</h1>
      <p class="textCanvas">Data:&nbsp;&nbsp;Na que der para você<br>Horário: No que você quiser</p>

      <canvas id="confetti"></canvas>

      <section class="mainButtonsContainer">
        <section class="buttonsContainer">
          <button class="liquidButton" onclick="yes()">
            <span>Sim</span>
            <div class="liquid"/></div>
          </button>
          <button class="negativeButton">
            <span><s>Não</s></span>
          </button>
          <div class="liquidButtonShadow"></div>
        </section>
      </section>

      <h2 class="letterTitle">Fevereiro de 2022</h2>
      <p class="letterText">Meus amigos me convenceram a ficar na sala do oitavo ano. Quando fui descoberto, fui para sua sala. Lembro de você, Gabriela e Viviane. Por algum motivo, achei que vocês eram irmãs. Você veio falar algo a respeito da Viviane, mas eu não me lembro bem, é só mais uma memória apagada</p>
      <p class="letterText">Esse dia foi o maior presente de Deus na minha vida; dinheiro nenhum compraria o prazer que foi te conhecer. Fui tão sortudo em te conhecer que sinto que posso ser atingido por um raio a qualquer instante devido ao azar que tenho, para compensar essa sorte</p>
      <p class="letterText">Acho que um dia você disse, no Instagram se não me engano, que iria trazer um chocolate para mim, e você realmente trouxe. Quem diria que eu ia retribuir 10 vezes mais?</p>
      <p class="letterText">E até então, quanto a você, eu era indiferente</p>

      <h2 class="letterTitle">Outubro de 2023</h2>
      <p class="letterText">Eu estava sentado com o Dentin, o João Pedro, na mesa do professor. Ele me desafiou a fazer uma cantada para você. Nesse momento, eu comecei a te olhar diferente, pois minha memória desse momento é clara como a luz do sol. Eu te chamei e disse: "Você, quando tá de longe, é linda, e quando tá perto parece que tá de longe." Acho que você só agradeceu</p>
      <p class="letterText">Eu acho que, se eu pudesse voltar no tempo, mesmo que 15 milhões de vezes, eu nunca mudaria nada nesse dia. O melhor dia da minha vida até agora</p>

      <h2 class="letterTitle">A partir de 2024</h2>
      <p class="letterText">Acho que, após isso, eu comecei a fazer várias cantadas de forma massante. Só parei quando percebi o quanto eu estava sendo insuportável; aliás, desculpa por isso</p>
      <p class="letterText">Depois disso, pedi ajuda ao Matheus para ter ideia do que fazer. Ele me deu a ideia de fazer cartas. Acho que nas primeiras eu falava muito do seu sorriso, que de fato acho lindo</p>
      <p class="letterText">Depois, escrevi uma carta pequena com a frase: "E minha chance? Nada ainda? - Admirador secreto", com um chiclete grudado. Lembro que você falou que achou sem criatividade. E esse convite, você achou criativo?</p>
      <p class="letterText">Depois, pedi para a Isis entregar uma carta com algo como: "Sei que você já disse várias vezes que não quer me dar uma chance, mas deixa eu te fazer feliz." Tinha um Stikadinho nessa carta, e eu acho que sua reação foi positiva, mas não lembro. A partir daí, comecei a te entregar várias cartas, e nenhuma delas foi sem um chocolate. Para ser sincero, acho que a maioria dessas cartas com chocolate eu entreguei só por entregar, só com o intuito de te deixar feliz</p>
      <p class="letterText">E agora, no final de outubro, estou te entregando este convite...</p>

      <h2 class="letterTitle">Novembro de 2024</h2>      
      <p class="letterText">Agora estou te fazendo este convite para que, se for da sua vontade, a gente possa conversar melhor, sem o clima estressante da escola. Não especifiquei nenhuma data e nenhum horário, porque sei que você mora longe, então isso não está sob meu controle</p>
      <p class="letterText">Eu te amo de verdade, então, se você aceitar este convite, ficarei muito feliz, você sabe. Você tem o sorriso mais lindo que já vi em toda minha vida, então, mesmo que você não aceite, desde que isso tire um sorriso seu, eu já estou satisfeito. Não conheço ninguém que tenha um carisma como o seu. Tudo em você é lindo: seu nariz, sua altura e principalmente seu cabelo, mas isso é só detalhe</p>
      <p class="letterText">Você conhece alguém que faria algo assim por você? Se sim, por que não fez? Por favor, dê valor às minhas palavras. Tudo o que fiz para você tem valido a pena, porque foi para você. Então, por favor, pense em aceitar</p>
      <p class="letterText">Te conhecer foi um presente de Deus. Desejo de coração que Deus te ilumine no querer e no realizar, para que todos os seus sonhos se realizem. Deus abençoe você e sua família</p>
      <div class="spacer"></div>

      <div class="BibleContainer">
        <h2 class="BibleText">O amor <span class="typed-text"></span><span class="cursor">&nbsp;</span></h2>
        <h3 class="BibleBook">1 Coríntios 13:7</h3>
      </div>
    `;

    const canvas1 = document.getElementById('waterCanvas');
    const ctx1 = canvas1.getContext('2d');
    canvas1.width = canvas1.offsetWidth;
    canvas1.height = canvas1.offsetHeight;

    const waves = [];
    const waveCount = 30;

    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for (let i = 0; i < waveCount; i++) {
        waves.push({
            y: (canvas1.height / 2), // 中央付近に分布
            length: 0.015,
            amplitude: (canvas1.height / 3),
            frequency: getRandom(10,20) / 1000,
            phase: Math.PI * 2
        });
      }

    let alpha = "0.01";
    let ticks = 0;

    function animate() {
        requestAnimationFrame(animate);

        ticks++;

        if(ticks >= 500){
          alpha = alpha === "0.01" ? "0.05" : "0.01";
          ticks = 0;
        }

        ctx1.fillStyle = `rgb(0,0,0,${alpha})`;
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
    }

    animate();

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
    
    canvas = document.getElementById('confetti')
    ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    button = document.querySelector(".liquidButton > span")
    }
  }
}

let confetti = [];
let sequins = [];

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

render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  confetti.forEach((confetto, index) => {
    let width = (confetto.dimensions.x * confetto.scale.x);
    let height = (confetto.dimensions.y * confetto.scale.y);
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);
    confetto.update();
    ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  sequins.forEach((sequin, index) => {
    ctx.translate(sequin.position.x, sequin.position.y);
    sequin.update();
    ctx.fillStyle = sequin.color;
    ctx.beginPath();
    ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  confetti.forEach((confetto, index) => {
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);
  });
  sequins.forEach((sequin, index) => {
    if (sequin.position.y >= canvas.height) sequins.splice(index, 1);
  });

  window.requestAnimationFrame(render);
};

function yes(){
  if (!disabled) {
  disabled = true
  // Loading stage
    setTimeout(() => {
      window.initBurst()
      render()
      navigator.vibrate([100,50,100,200,1000]);
      setTimeout(() => {
        // Reset button so user can select it again
        disabled = false;

        window.location.href = `instagram://user?username=${encodeURIComponent("tiago.xeke")}`;
      }, 3000)
    }, 300)
}
}

function getLetterParam(){
  const urlParams = new URLSearchParams(window.location.search);
  let letter = urlParams.get("letter");

  letter = letter ? parseInt(letter, 10) : 0;
  return isNaN(letter) ? 0 : letter;
}

const letter = getLetterParam();
renderPage(letter);