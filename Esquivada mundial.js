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
let teclas = {
    izquierda: false,
    derecha: false
};

// Elemento jugador
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
    else if (teclas.derecha) {
        posX += speed;
        jugador.style.transform = "scaleX(1)";
    }

    actualizarPosicion();
    requestAnimationFrame(moverJugador);
}

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

    if (!caminando) {
        caminando = true;
        requestAnimationFrame(animarCaminar);
    }
});

document.addEventListener("keyup", () => {
    teclas.izquierda = false;
    teclas.derecha = false;
    caminando = false;
    jugador.style.backgroundImage = `url(${imgParado})`;
});


// -----------------------------------------
// ACTUALIZAR POSICIÓN
// -----------------------------------------
function actualizarPosicion() {
    jugador.style.left = `${posX}px`;
    jugador.style.top = `${posY}px`;
}






    













