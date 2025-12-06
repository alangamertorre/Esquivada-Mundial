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
            // Mirar a la izquierda (invertido)
            jugador.style.transform = "scaleX(-1)";
            break;

        case "ArrowRight":
        case "d":
        case "D":
            posX += speed;
            // Mirar a la derecha (normal)
            jugador.style.transform = "scaleX(1)";
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
// SISTEMA DE METEORITOS
// -----------------------------------------

function crearMeteorito() {
    const meteorito = document.createElement("div");
    meteorito.style.rotate = `33deg`;
    meteorito.classList.add("meteorito");
    meteorito.style.backgroundImage = `url(${imgMeteorito})`;

    // Posición inicial aleatoria
    const xRandom = Math.random() * (window.innerWidth - 60);
    meteorito.style.left = `${xRandom}px`;
    meteorito.style.top = `-80px`;

    document.body.appendChild(meteorito);

    let y = -80;

    function caida() {
        y += 6; // velocidad del meteoro
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

    const choque =
        pj.left < mt.right &&
        pj.right > mt.left &&
        pj.top < mt.bottom &&
        pj.bottom > mt.top;

    if (choque) {
        alert("¡Has sido alcanzado por un meteorito! Juego terminado.");
        window.location.reload(); // pantalla de muerte (por hacer)
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


// ---------------------------------------------------------
// FIN DEL CÓDIGO
// ---------------------------------------------------------





    





