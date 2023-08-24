const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const jugador = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    velocidad: 5,
    vidas: 3
};

const meteoritos = [];
const corazones = [];
const disparos = []; 
let showVelocity = true;
let showVelocityMeteorito = true;
let debugMode = false;

const cuadroLetras = {
    x: canvas.width - 150,
    y: 0,
    ancho: 100,
    alto: 50
};

const cuadroScore = {
    x: canvas.width / 2-250,
    y: 0,
    ancho: 120,
    alto: 45
};

const cuadroVidas = {
    x: 0,
    y: 0,
    ancho: 85,
    alto: 45
};

function dibujarJugador() {
    ctx.beginPath();
    ctx.moveTo(jugador.x, jugador.y);
    ctx.lineTo(jugador.x - 40, jugador.y + 80);
    ctx.lineTo(jugador.x + 40, jugador.y + 80);
    ctx.closePath();
    ctx.fillStyle = "#00FF00";
    ctx.fill();
}

const jugadorImagen = new Image();
jugadorImagen.src = 'img/cupi.png'; // Cambia el nombre de archivo por el de tu imagen


function dibujarJugador() {
    ctx.drawImage(jugadorImagen, jugador.x - 40, jugador.y - 40, 120, 80); // Ajusta el tamaño y posición de la imagen
    if (showVelocity) {
        ctx.font = "60px Arial";
        ctx.fillStyle = "#00FF00";
        ctx.fillText(jugador.velocidad, jugador.x + 40, jugador.y + 30);    
    }
}

function dibujarMeteoritos() {
    for (const meteorito of meteoritos) {
        ctx.beginPath();
        ctx.arc(meteorito.x, meteorito.y, meteorito.radio, 0, Math.PI * 2);
        ctx.fillStyle = meteorito.color;
        ctx.fill();
        ctx.closePath();

        meteorito.y += meteorito.velocidadY;

        if (meteorito.y > canvas.height + meteorito.radio) {
            meteorito.y = -meteorito.radio;
            meteorito.x = Math.random() * canvas.width
        }
    }
}

function dibujarCorazones() {
    for (const corazon of corazones) {
        ctx.beginPath();
        ctx.moveTo(corazon.x + corazon.radio, corazon.y);
        ctx.bezierCurveTo(
            corazon.x + corazon.radio,
            corazon.y - corazon.radio,
            corazon.x,
            corazon.y - corazon.radio * 1.5,
            corazon.x - corazon.radio,
            corazon.y
        );
        ctx.bezierCurveTo(
            corazon.x - corazon.radio * 2,
            corazon.y + corazon.radio * 0.5,
            corazon.x - corazon.radio * 2,
            corazon.y + corazon.radio * 1.5,
            corazon.x - corazon.radio,
            corazon.y + corazon.radio * 2
        );
        ctx.bezierCurveTo(
            corazon.x,
            corazon.y + corazon.radio * 1.5,
            corazon.x + corazon.radio,
            corazon.y + corazon.radio,
            corazon.x + corazon.radio,
            corazon.y
        );
        ctx.closePath();
        
        if (corazon.visible) {
            ctx.fillStyle = corazon.color;
            ctx.fill();
        }

        if (corazon.parpadeoVisible) {
            corazon.visible = !corazon.visible;
        }
        corazon.parpadeoVisible = !corazon.parpadeoVisible;

        corazon.y += corazon.velocidadY;

        if (corazon.y > canvas.height + corazon.radio) {
            corazon.y = -corazon.radio;
            corazon.x = Math.random() * canvas.width;
        }
    }
}

function dibujarDisparos() {
    for (const disparo of disparos) {
        ctx.beginPath();
        ctx.arc(disparo.x, disparo.y, disparo.radio, 0, Math.PI * 2);
        ctx.fillStyle = disparo.color;
        ctx.fill();
        ctx.closePath();

        disparo.y -= disparo.velocidad;

        // Comprobar colisión con meteoritos
        for (const meteorito of meteoritos) {
            const distanciaX = disparo.x - meteorito.x;
            const distanciaY = disparo.y - meteorito.y;
            const distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

            if (distancia < disparo.radio + meteorito.radio) {
                // Destruir meteorito y sumar puntos
                meteorito.y = -meteorito.radio;
                meteorito.x = Math.random() * canvas.width;
                
                jugador.puntos += 1;
            }
        }

        // Eliminar el disparo si sale de la pantalla
        if (disparo.y < -disparo.radio) {
            disparos.splice(disparos.indexOf(disparo), 1);
        }
    }
}

function dibujarCuadros() {
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(cuadroLetras.x, cuadroLetras.y, cuadroLetras.ancho, cuadroLetras.alto);

    ctx.fillStyle = "#00FF00";
    ctx.fillRect(cuadroScore.x, cuadroScore.y, cuadroScore.ancho, cuadroScore.alto);

    ctx.fillStyle = "#0000FF";
    ctx.fillRect(cuadroVidas.x, cuadroVidas.y, cuadroVidas.ancho, cuadroVidas.alto);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#000000";
    ctx.fillText("A", cuadroLetras.x + 40, cuadroLetras.y + 30);
    ctx.fillText("Score: " + jugador.puntos, cuadroScore.x + 10, cuadroScore.y + 30);
    ctx.fillText("Vidas: " + jugador.vidas, cuadroVidas.x + 10, cuadroVidas.y + 30);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "a" || event.key === "A" || event.key === "ArrowLeft") {
        jugador.x -= jugador.velocidad;
        if (debugMode)   showVelocity = !showVelocity
    } else if (event.key === "d" || event.key === "D" || event.key === "ArrowRight") {
        jugador.x += jugador.velocidad;
    } else if (event.key === " " || event.key === "w" ||event.key === "D" || event.key === "ArrowUp") { // Disparar al presionar la tecla "W"
        const disparo = {
            x: jugador.x,
            y: jugador.y,
            radio: 5,
            velocidad: 5,
            color: "#FFA500"
        };
        disparos.push(disparo);
    }
});

function dibujarEscena() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dibujarCuadros();
    dibujarJugador();
    dibujarMeteoritos();
    dibujarCorazones();
    dibujarDisparos();

    requestAnimationFrame(dibujarEscena);
}

function iniciarJuego() {
    for (let i = 0; i < 5; i++) {
        const meteorito = {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            radio: Math.random() * 20 + 10,
            velocidadY: Math.random() * 1 + 1,
            color: getRandomColor(), // Agrega un color aleatorio
        };
        meteoritos.push(meteorito);
    }

    jugador.puntos = 0;

    dibujarEscena();

        const corazon = {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            radio: 1,
            velocidadY: Math.random() * 0.0 + 0.1,
            color: "red",
            visible: true,
            parpadeoVisible: true
        };
        corazones.push(corazon);
    }

    jugador.puntos = 0; // Agregar propiedad para almacenar puntos del jugador

    dibujarEscena();

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    function dibujarMeteoritos() {
        for (const meteorito of meteoritos) {
            ctx.beginPath();
            ctx.arc(meteorito.x, meteorito.y, meteorito.radio, 0, Math.PI * 2);
            ctx.fillStyle = meteorito.color; // Usa el color aleatorio del meteorito
            ctx.fill();
            ctx.closePath();
    
            meteorito.y += meteorito.velocidadY;
    
            if (meteorito.y > canvas.height + meteorito.radio) {
                meteorito.y = -meteorito.radio;
                meteorito.x = Math.random() * canvas.width;
            }
        }
    }

const cuadroCorazon = {
    x: Math.random() * (canvas.width - 100), // Posición X aleatoria
    y: -90, // Comienza arriba del lienzo
    ancho: 100,
    alto: 90
};

let latido = 1;
let creciendo = true;

function dibujarCorazon() {
    const anchoActual = cuadroCorazon.ancho * latido;
    const altoActual = cuadroCorazon.alto * latido;

    ctx.beginPath();
    ctx.moveTo(cuadroCorazon.x + anchoActual / 2, cuadroCorazon.y);
    ctx.bezierCurveTo(
        cuadroCorazon.x + anchoActual,
        cuadroCorazon.y,
        cuadroCorazon.x + anchoActual,
        cuadroCorazon.y + altoActual / 2,
        cuadroCorazon.x + anchoActual / 2,
        cuadroCorazon.y + altoActual
    );
    ctx.bezierCurveTo(
        cuadroCorazon.x,
        cuadroCorazon.y + altoActual / 2,
        cuadroCorazon.x,
        cuadroCorazon.y,
        cuadroCorazon.x + anchoActual / 2,
        cuadroCorazon.y
    );
    ctx.closePath();

    ctx.fillStyle = "green";
    ctx.fill();
}

function animarCorazon() {
    cuadroCorazon.y += 2; // Ajusta la velocidad de caída aquí

    if (creciendo) {
        latido += 0.02;
    } else {
        latido -= 0.02;
    }

    if (latido > 1.2 || latido < 1) {
        creciendo = !creciendo;
    }

    dibujarCorazon();

    if (cuadroCorazon.y < canvas.height) {
        requestAnimationFrame(animarCorazon);
    } else {
        // Si el corazón sale de la pantalla, restablecer su posición arriba y a la izquierda
        cuadroCorazon.x = Math.random() * (canvas.width - 100);
        cuadroCorazon.y = -cuadroCorazon.alto;
    }
}

animarCorazon();

iniciarJuego();




