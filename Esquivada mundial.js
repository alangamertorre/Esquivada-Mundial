// ---------------- IMÁGENES ----------------
const imgParado = "soldado-estable.png";
const imgCaminar = ["soldado-caminar1.png", "soldado-caminar2.png"];
const imgMeteorito = "meteorito.png";

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
const fuerzaSalto = -15;
const suelo = posY;

// ---------------- ANIMACIÓN ----------------
function animarCaminar(t) {
    if (!caminando) return;

    if (t - ultimoFrame > 120) {
        frame = (frame + 1) % imgCaminar.length;
        jugador.style.backgroundImage = `url(${imgCaminar[frame]})`;
        ultimoFrame = t;
    }
    requestAnimationFrame(animarCaminar);
}

// ---------------- MOVIMIENTO ----------------
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

    requestAnimationFrame(moverJugador);
}
requestAnimationFrame(moverJugador);

// ---------------- TECLADO ----------------
document.addEventListener("keydown", e => {
    if (["a","A","ArrowLeft"].includes(e.key)) teclas.izquierda = true;
    if (["d","D","ArrowRight"].includes(e.key)) teclas.derecha = true;

    if (!caminando && (teclas.izquierda || teclas.derecha)) {
        caminando = true;
        requestAnimationFrame(animarCaminar);
    }

    if ([" ","ArrowUp","w","W"].includes(e.key) && !saltando) {
        e.preventDefault();
        saltando = true;
        velocidadY = fuerzaSalto;
    }
});

document.addEventListener("keyup", e => {
    if (["a","A","ArrowLeft"].includes(e.key)) teclas.izquierda = false;
    if (["d","D","ArrowRight"].includes(e.key)) teclas.derecha = false;

    if (!teclas.izquierda && !teclas.derecha) {
        caminando = false;
        jugador.style.backgroundImage = `url(${imgParado})`;
    }
});

// ---------------- METEORITOS ----------------
function crearMeteorito() {
    const m = document.createElement("div");
    m.className = "meteorito";
    m.style.backgroundImage = `url(${imgMeteorito})`;
    m.style.transform = "rotate(33deg)";
    m.style.left = Math.random() * (window.innerWidth - 50) + "px";
    m.style.top = "-60px";
    document.body.appendChild(m);

    let y = -60;
    function caer() {
        y += 6;
        m.style.top = y + "px";
        detectarColision(m);
        if (y < window.innerHeight + 100) requestAnimationFrame(caer);
        else m.remove();
    }
    caer();
}

// ---------------- COLISIONES ----------------
function detectarColision(m) {
    const a = jugador.getBoundingClientRect();
    const b = m.getBoundingClientRect();

    if (
        a.left < b.right - 15 &&
        a.right > b.left + 15 &&
        a.top < b.bottom - 15 &&
        a.bottom > b.top + 15
    ) {
        alert("💥 Juego terminado");
        location.reload();
    }
}

setInterval(crearMeteorito, 1200);








    


















