const canvas = document.getElementById('waterCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const waves = [];
const waveCount = 20;

for (let i = 0; i < waveCount; i++) {
    waves.push({
        y: (canvas.height / 2) - 10 + Math.random() * 20, // 中央付近に分布
        length: 0.015 + Math.random() * 0.005,
        amplitude: i % 2 === 1 ? 0.01 + Math.random() * 70 : 0.01 + Math.random() * 50,
        frequency: i % 2 === 1 ? 0.01 + Math.random() * 0.01 : 0.03 + Math.random() * 0.01,
        phase: Math.random() * Math.PI * 2
    });
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomCoords(xmin, xmax,ymin,ymax, propNumberx,propNumbery) {
    let randomCoords = {};
    let x = Math.floor(Math.random() * (xmax - xmin + 1)) + xmin;
    let y = Math.floor(Math.random() * (ymax - ymin + 1)) + ymin;
    let propx = xmax / propNumberx;
    let propy = ymax / propNumbery;

    if((x < propx || x > xmax - propx) && (y < propy || y > ymax - propy)){
        randomCoords = getRandomCoords(xmin, xmax,ymin,ymax, propNumberx,propNumbery)
    }else if((x < propx || x > xmax - propx) || (y < propy || y > ymax - propy)){
        randomCoords = getRandom(0,1) === 1
            ? getRandomCoords(xmin, xmax,ymin,ymax, propNumberx,propNumbery)
            : randomCoords = {x:x,y:y};
    }else{
        randomCoords = {x:x,y:y}
    }

    return randomCoords;
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "#0000001A"; // 透明度を0.1に調整
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(var j = 0; j < 10; j++){
        let coords = getRandomCoords(0,canvas.width,0, canvas.height,14,7)
            ctx.fillStyle = j % 2 === 1 ? "#0055FF" : "#FFFFFF";
            ctx.fillRect(coords.x,coords.y,1,1)
        }

    waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.moveTo(0, wave.y);
        for (let i = 0; i < canvas.width; i++) {
            const yOffset = Math.sin(i * wave.length + wave.phase) * wave.amplitude * Math.sin(wave.phase);
            ctx.lineTo(i, wave.y + yOffset);
        }
        ctx.strokeStyle = `hsl(${index / 2 + 220}, 100%, 50%)`;
        ctx.stroke();

        wave.phase += wave.frequency;
    });
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    waves.forEach((wave) => {
        wave.y = (canvas.height / 2) - 100 + Math.random() * 200; // 中央付近に再配置
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