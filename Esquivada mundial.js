//-----------------------------------------
// CONFIGURACIÓN DE IMÁGENES
//-----------------------------------------
const imgParado = "soldado-estable.png";
const imgCaminar = ["soldado-caminar1.png", "soldado-caminar2.png"];
const imgMeteorito = "meteorito.png";

// -----------------------------------------
// VARIABLES DEL JUGADOR
// -----------------------------------------
let posX = window.innerWidth / 2;
let posY = window.innerHeight * 0.63;
let caminando = false;
let frame = 0;
let ultimoFrame = 0;

// Sistema de salto
let saltando = false;
let velocidadY = 0;
const gravedad = 0.8;
const fuerzaSalto = -15;
const suelo = window.innerHeight * 0.63;

// teclas activas
let teclas = {
    izquierda: false,
    derecha: false
};

// Elemento del jugador
const jugador = document.getElementById("jugador");
jugador.style.backgroundImage = `url(${imgParado})`;


// -----------------------------------------
// ANIMACIÓN DEL JUGADOR
// -----------------------------------------
function animarCaminar(timestamp) {
    if (!caminando) return;

    if (timestamp - ultimoFrame > 120) {
        frame = (frame + 1) % imgCaminar.length;
        jugador.style.backgroundImage = `url(${imgCaminar[frame]})`;
        ultimoFrame = timestamp;
    }

    requestAnimationFrame(animarCaminar);
}


// -----------------------------------------
// MOVIMIENTO CONTINUO
// -----------------------------------------
function moverJugador() {
    const speed = 7;

    if (teclas.izquierda) {
        posX -= speed;
        jugador.style.transform = "scaleX(-1)";
    }
    if (teclas.derecha) {
        posX += speed;
        jugador.style.transform = "scaleX(1)";
    }

    // Física del salto
    if (saltando) {
        velocidadY += gravedad;
        posY += velocidadY;

        // Verificar si llegó al suelo
        if (posY >= suelo) {
            posY = suelo;
            velocidadY = 0;
            saltando = false;
        }
    }

    // Limitar movimiento horizontal
    const margen = 40;
    if (posX < margen) posX = margen;
    if (posX > window.innerWidth - margen) posX = window.innerWidth - margen;

    actualizarPosicion();
    requestAnimationFrame(moverJugador);
}

// iniciar loop de movimiento continuo
requestAnimationFrame(moverJugador);


// -----------------------------------------
// INPUT DEL TECLADO
// -----------------------------------------
document.addEventListener("keydown", (e) => {

    if (["ArrowLeft", "a", "A"].includes(e.key)) {
        teclas.izquierda = true;
    }

    if (["ArrowRight", "d", "D"].includes(e.key)) {
        teclas.derecha = true;
    }

    // Salto con espacio o flecha arriba
    if ([" ", "ArrowUp", "w", "W"].includes(e.key) && !saltando) {
        e.preventDefault(); // Evitar scroll con espacio
        saltando = true;
        velocidadY = fuerzaSalto;
    }

    if (!caminando && (teclas.izquierda || teclas.derecha)) {
        caminando = true;
        requestAnimationFrame(animarCaminar);
    }
});

document.addEventListener("keyup", (e) => {
    if (["ArrowLeft", "a", "A"].includes(e.key)) {
        teclas.izquierda = false;
    }
    
    if (["ArrowRight", "d", "D"].includes(e.key)) {
        teclas.derecha = false;
    }

    if (!teclas.izquierda && !teclas.derecha) {
        caminando = false;
        jugador.style.backgroundImage = `url(${imgParado})`;
    }
});


// -----------------------------------------
// ACTUALIZAR POSICIÓN
// -----------------------------------------
function actualizarPosicion() {
    jugador.style.left = `${posX}px`;
    jugador.style.top = `${posY}px`;
}


// -----------------------------------------
// SISTEMA DE METEORITOS
// -----------------------------------------
function crearMeteorito() {
    const meteorito = document.createElement("div");
    meteorito.classList.add("meteorito");
    meteorito.style.backgroundImage = `url(${imgMeteorito})`;
    meteorito.style.transform = `rotate(33deg)`;
    meteorito.style.width = "50px";
    meteorito.style.height = "50px";

    // Posición aleatoria
    const xRandom = Math.random() * (window.innerWidth - 50);
    meteorito.style.left = `${xRandom}px`;
    meteorito.style.top = `-80px`;

    document.body.appendChild(meteorito);

    let y = -80;

    function caida() {
        y += 6;
        meteorito.style.top = `${y}px`;

        detectarColision(meteorito);

        if (y < window.innerHeight + 100) {
            requestAnimationFrame(caida);
        } else {
            meteorito.remove();
        }
    }

    caida();
}


// -----------------------------------------
// COLISIONES
// -----------------------------------------
function detectarColision(meteorito) {
    const pj = jugador.getBoundingClientRect();
    const mt = meteorito.getBoundingClientRect();

    const reduccion = 15;

    const mtHitbox = {
        left: mt.left + reduccion,
        right: mt.right - reduccion,
        top: mt.top + reduccion,
        bottom: mt.bottom - reduccion
    };

    const choque =
        pj.left < mtHitbox.right &&
        pj.right > mtHitbox.left &&
        pj.top < mtHitbox.bottom &&
        pj.bottom > mtHitbox.top;

    if (choque) {
        alert("¡Has sido alcanzado por un meteorito! Juego terminado.");
        window.location.reload();
    }
}


// -----------------------------------------
// GENERAR METEORITOS CADA X TIEMPO
// -----------------------------------------
if (!window.meteorInterval) {
    window.meteorInterval = setInterval(() => {
        crearMeteorito();
    }, 1200);
}








    

















