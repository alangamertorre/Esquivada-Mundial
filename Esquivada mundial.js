// -----------------------------------------
// CONFIGURACIÓN DE IMÁGENES
// -----------------------------------------
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

// Elementos del DOM
const jugador = document.getElementById("jugador");
jugador.style.backgroundImage = `url(${imgParado})`;


// -----------------------------------------
// MOVIMIENTO DEL JUGADOR
// -----------------------------------------

document.addEventListener("keydown", (e) => {
    const speed = 20;
    caminando = true;

    switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
            posX -= speed;
            break;

        case "ArrowRight":
        case "d":
        case "D":
            posX += speed;
            break;

        case "ArrowUp":
            posY -= speed;
            break;

        case "ArrowDown":
            posY += speed;
            break;
    }

    actualizarPosicion();
});

document.addEventListener("keyup", () => {
    caminando = false;
    jugador.style.backgroundImage = `url(${imgParado})`;
});

function actualizarPosicion() {
    jugador.style.left = `${posX}px`;
    jugador.style.top = `${posY}px`;
}


// -----------------------------------------
// ANIMACIÓN DEL SOLDADO
// -----------------------------------------

function animarJugador(time) {
    if (caminando) {
        if (time - ultimoFrame > 120) {
            frame = (frame + 1) % 2;
            jugador.style.backgroundImage = `url(${imgCaminar[frame]})`;
            ultimoFrame = time;
        }
    }
    requestAnimationFrame(animarJugador);
}
requestAnimationFrame(animarJugador);


// -----------------------------------------
// SISTEMA DE METEORITOS
// -----------------------------------------

function crearMeteorito() {
    const meteorito = document.createElement("div");
    meteorito.classList.add("meteorito");
    meteorito.style.backgroundImage = `url(${imgMeteorito})`;

    // Posición inicial aleatoria
    const xRandom = Math.random() * (window.innerWidth - 60);
    meteorito.style.left = `${xRandom}px`;
    meteorito.style.top = `-80px`;

    document.body.appendChild(meteorito);

    let y = -80;

    function caída() {
        y += 6; // velocidad del meteoro
        meteorito.style.top = `${y}px`;

        detectarColision(meteorito);

        if (y < window.innerHeight + 100) {
            requestAnimationFrame(caída);
        } else {
            meteorito.remove();
        }
    }

    caída();
}


// -----------------------------------------
// COLISIONES
// -----------------------------------------

function detectarColision(meteorito) {
    const pj = jugador.getBoundingClientRect();
    const mt = meteorito.getBoundingClientRect();

    const choque =
        pj.left < mt.right &&
        pj.right > mt.left &&
        pj.top < mt.bottom &&
        pj.bottom > mt.top;

    if (choque) {
        alert("¡Has sido golpeado por un meteorito!");
        location.reload();
    }
}


// -----------------------------------------
// GENERAR METEORITOS CADA X TIEMPO
// -----------------------------------------

setInterval(() => {
    crearMeteorito();
}, 1200); // cada 1.2 segundos

// ---------------------------------------------------------
// FIN DEL CÓDIGO
// ----------------------------------------------------------



    
