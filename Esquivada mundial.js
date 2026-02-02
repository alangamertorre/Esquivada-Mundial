// ---------------- IMÁGENES ----------------


  const imgParado = "soldado-estable.png";
  const imgCaminar = ["soldado-caminar1.png", "soldado-caminar2.png"];
  const imgMeteorito = "meteorito.png";
  const imgBala = "Bala.png";

// ---------------- JUGADOR ----------------
const jugador = document.getElementById("jugador");
jugador.style.backgroundImage = `url(${imgParado})`;

let posX = window.innerWidth / 2;
let posY = window.innerHeight * 0.63;

let teclas = { izquierda:false, derecha:false };
let caminando = false;
let frame = 0;
let ultimoFrame = 0;

// SALTO
let saltando = false;
let velocidadY = 0;
const gravedad = 0.8;
const fuerzaSalto = -16;
const suelo = posY;

let gameOver = false;
// ---------------- ANIMACIÓN ----------------
function animarCaminar(t) {
    if (!caminando) return;
    if (gameOver === false && juegoIniciado === true) {

    if (t - ultimoFrame > 120) {
        frame = (frame + 1) % imgCaminar.length;
        jugador.style.backgroundImage = `url(${imgCaminar[frame]})`;
        ultimoFrame = t;
    }
    requestAnimationFrame(animarCaminar);
 }
}

// ---------------- MOVIMIENTO ----------------
function moverJugador() {
  if (gameOver === false && juegoIniciado === true) {
    const speed = 7;

    if (teclas.izquierda) {
        posX -= speed;
        jugador.style.transform = "scaleX(-1)";
    }
    if (teclas.derecha) {
        posX += speed;
        jugador.style.transform = "scaleX(1)";
    }

    if (saltando) {
        velocidadY += gravedad;
        posY += velocidadY;

        if (posY >= suelo) {
            posY = suelo;
            velocidadY = 0;
            saltando = false;
        }
    }

    posX = Math.max(40, Math.min(window.innerWidth - 40, posX));

    jugador.style.left = posX + "px";
    jugador.style.top = posY + "px";

   }   requestAnimationFrame(moverJugador);
}
requestAnimationFrame(moverJugador);

// ---------------- TECLADO ----------------


document.addEventListener("keydown", e => {
    if (["a", "A", "ArrowLeft"].includes(e.key)) teclas.izquierda = true;
    if (["d", "D", "ArrowRight"].includes(e.key)) teclas.derecha = true;

    if (!caminando && (teclas.izquierda || teclas.derecha)) {
        caminando = true;
        requestAnimationFrame(animarCaminar);
    }

    if ([" ", "ArrowUp", "w", "W"].includes(e.key) && !saltando) {
        e.preventDefault();
        saltando = true;
        velocidadY = fuerzaSalto;
    }
});


document.addEventListener("keyup", e => {
    if (["a", "A", "ArrowLeft"].includes(e.key)) teclas.izquierda = false;
    if (["d", "D", "ArrowRight"].includes(e.key)) teclas.derecha = false;

    if (!teclas.izquierda && !teclas.derecha) {
        caminando = false;
        jugador.style.backgroundImage = `url(${imgParado})`;
    }
});


// ---------------- METEORITOS ----------------
function crearMeteorito() {
  if (gameOver === false && juegoIniciado === true) {  
    const m = document.createElement("div");
    m.className = "meteorito";
    m.style.backgroundImage = `url(${imgMeteorito})`;
    m.style.transform = "rotate(33deg)";
    m.style.left = Math.random() * (window.innerWidth - 50) + "px";
    m.style.top = "-60px";
    document.body.appendChild(m);

    let y = -60;

    function caer() {
      if (gameOver === false && juegoIniciado === true) {  
        y += 6;
        m.style.top = y + "px";
        detectarColision(m);

        if (y < window.innerHeight + 100) {
            requestAnimationFrame(caer);
        } else {
            m.remove();
        }
    }}
    caer();
        if (debugVisible === true) {
    m.style.backgroundColor = "rgb(0, 255, 0)";
    }
}
}
// ---------------- BALAS ----------------
function crearBala() {
  if (gameOver === false && juegoIniciado === true) {  
    const b = document.createElement("div");
    b.className = "bala";
    b.style.backgroundImage = `url(${imgBala})`;

    b.style.left = "0px";
    b.style.top = (Math.random() * 70 + (jugador.offsetTop - 20)) + "px";

    document.body.appendChild(b);

    let x = 0;

    function mover() {
      if (gameOver === false) {  
        x += 12;
        b.style.left = x + "px";
        detectarColision(b);

        if (x < window.innerWidth + 50) {
            requestAnimationFrame(mover);
        } else {
            b.remove();
        }
      }
    }
    mover();
    if (debugVisible === true) {
    b.style.backgroundColor = "rgb(0, 0, 255)";
    }
}
}
// ---------------- COLISIONES ----------------
function detectarColision(objeto) {
    const a = jugador.getBoundingClientRect();
    const b = objeto.getBoundingClientRect();

    if (
        a.left < b.right - 15 &&
        a.right > b.left + 15 &&
        a.top < b.bottom - 15 &&
        a.bottom > b.top + 15
    ) {
      function jt() {  
        // Colisión detectada
        terminarJuego();
        clearInterval(meteoritoTimer);
        clearInterval(balaTimer);
        
    }jt();
    }    
}

//añadido
  function detectarColisionRedonda(obj) {
    // Jugador
    const a = jugador.getBoundingClientRect();
    const a_cx = a.left + a.width/2;
    const a_cy = a.top + a.height/2;
    const a_r = Math.min(a.width,a.height)/2 - 10; // -10 para ajuste

    // Objeto
    const b = obj.getBoundingClientRect();
    const b_cx = b.left + b.width/2;
    const b_cy = b.top + b.height/2;
    const b_r = Math.min(b.width,b.height)/2 - 5;

    const dx = a_cx - b_cx;
    const dy = a_cy - b_cy;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if(dist < a_r + b_r){
        jt();
    }
}




// ---------------- TIEMPO ----------------
const tiempo = document.getElementById("tiempo");
const nivel = document.getElementById("nivel");

let tiempoS = 0;
let tiempoM = 0;

let timer; // guardará el intervalo

// Mostrar tiempo inicial
tiempo.innerText =
    tiempoM + ":" + tiempoS.toString().padStart(2, "0");


function mt() {

    if(gameOver||!juegoIniciado)return;// si el juego terminó o no inicio, no cuenta

    tiempoS++;

    if (tiempoS === 60) {
        tiempoM++;
        tiempoS = 0;
    }

    tiempo.innerText =
        tiempoM + ":" + tiempoS.toString().padStart(2, "0");

    actualizarDificultad();
}

// iniciar contador
timer = setInterval(mt, 1000);

// ---------------- GAME OVER ----------------
function terminarJuego() {
    gameOver = true;
    clearInterval(timer); // 👈 ESTO LO PARA
}

// ---------------- DIFICULTAD ----------------
let balaI = 4000;
let meteoritoI = 1200;
let nivelP = 1;

let x = 12;
let y = 6;

nivel.innerText = "Nivel: " + nivelP;

// Timers reales de juego
let meteoritoTimer = setInterval(crearMeteorito, meteoritoI);
let balaTimer = setInterval(crearBala, balaI);
const level = document.getElementById("levelUp");

function actualizarDificultad() {
    let nuevoNivel = 1;

    // tiempo total en segundos (más limpio)
    let tiempoTotal = tiempoM * 60 + tiempoS;

    if (tiempoTotal >= 120) {
        balaI = 3250;
        meteoritoI = 700;
        x = 16;
        y = 14;
        nuevoNivel = 4 + '(max.)';

    } else if (tiempoTotal >= 90) {
        balaI = 3500;
        meteoritoI = 700;
        x = 16;
        y = 13;
        nuevoNivel = 3;

    } else if (tiempoTotal >= 60) {
        balaI = 3800;
        meteoritoI = 900;
        x = 14;
        y = 10;
        nuevoNivel = 2;
    }

    // Solo actuar si cambia el nivel
    if (nuevoNivel !== nivelP) {
        nivelP = nuevoNivel;
        nivel.innerText = "Nivel: " + nivelP;
        level.play()
        actualizarDebug();

        clearInterval(meteoritoTimer);
        clearInterval(balaTimer);

        meteoritoTimer = setInterval(crearMeteorito, meteoritoI);
        balaTimer = setInterval(crearBala, balaI);
    }
}

// ---------------- DEBUG ----------------
const debug = document.getElementById("debug");

// oculto al inicio
debug.style.display = "none";

// para que los \n funcionen visualmente
debug.style.whiteSpace = "pre-line";

function actualizarDebug() {
    debug.innerText =
        'Velocidad Balas: ' + x + '\n' +
        'Velocidad Meteoritos: ' + y + '\n' +
        'Intervalo Balas: ' + balaI + ' ms\n' +
        'Intervalo Meteoritos: ' + meteoritoI + ' ms';
}
let debugVisible = false;
// tecla P para mostrar/ocultar
document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "p") {

        if (debug.style.display === "none" && gameOver === false && juegoIniciado === true) {
            actualizarDebug();
            debug.style.display = "block";
            jugador.style.border = "2px solid rgb(255, 0, 0)";
            debugVisible = true;
        } else {
            debug.style.display = "none";
            jugador.style.border = "0px";
            debugVisible = false;
        }

    }
});

// ----------------PANTALLAS----------------
 // -----------------Game Over----------------
const gameOverScreen = document.querySelector(".GameOver");
  gameOverScreen.style.display = "none";


const Sfinal = document.getElementById("gameoverS");
   // function Game Over
function terminarJuego() {
    gameOver = true;
    gameOverScreen.style.display = "block";
    Sfinal.play();
    TxtGameOver1.style.display = "block";
    TxtGameOver2.style.display = "block";
}
   //Botones de Game Over
    //texto
    const TxtGameOver1 = document.querySelector(".TxtGO");
    const TxtGameOver2 = document.querySelector(".TxtGO2");
    console.log(TxtGameOver1);
    console.log(TxtGameOver2);
    TxtGameOver1.style.display = "none";
    TxtGameOver2.style.display = "none";
    
    //botones
    const play = document.querySelector(".play");
    const exit = document.querySelector(".exit");
//Boton de Reintentar
    play.addEventListener("click", () => {

    document.querySelectorAll(".meteorito").forEach(m => m.remove());
    document.querySelectorAll(".bala").forEach(b => b.remove());

    clearInterval(meteoritoTimer);
    clearInterval(balaTimer);
    clearInterval(timer);

    timer = setInterval(mt, 1000);
meteoritoI = 1200;
balaI = 4000;
nivelP = 1;
nivel.innerText = "Nivel: " + nivelP;
meteoritoTimer = setInterval(crearMeteorito, meteoritoI);
balaTimer = setInterval(crearBala, balaI);
    tiempoS = 0;
    tiempoM = 0;
    tiempo.innerText =
        tiempoM + ":" + tiempoS.toString().padStart(2, "0");

    actualizarDificultad();

    gameOver = false;
    juegoIniciado = true;
    gameOverScreen.style.display = "none";

    posX = window.innerWidth / 2;
    posY = window.innerHeight * 0.63;

    jugador.style.left = posX + "px";
    jugador.style.top = posY + "px";
});

//boton de Salir
    exit.addEventListener("click", () => {
        location.reload();
        gameOver = false;
        gameOverScreen.style.display = "none";
        juegoIniciado = false;
    });
// -----------------Inicio----------------
const inicioScreen = document.querySelector(".fondo");
let juegoIniciado = false;

if (juegoIniciado === false) {
    inicioScreen.style.display = "block";
} else {
    inicioScreen.style.display = "none";
}
//Boton de Inicio
const playI = document.querySelector(".playI");
playI.addEventListener("click", () => {
    inicioScreen.style.display = "none";
    juegoIniciado = true;
    alert('Consejo: Reinicia el juego despues de hacer pantalla completa para evitar errores visuales.');
});

playI.addEventListener("mouseenter", () => {
    playI.style.transform = "scale(1.01)";
    console.log("Cursor entróP");
});
playI.addEventListener("mouseleave", () => {
    playI.style.transform = "scale(1.0)";
    console.log("Cursor salióP");
});









    




















