const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");


const jugador = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    velocidad: 3,
    nombre: "",
    vidas: 3,
    timer: "10:00"
};

const particulas = [];
const meteoritos = [];
const corazones = [];
const disparos = []; 
let showVelocity = true;
let showVelocityMeteorito = true;
let debugMode = true;

const cuadroLetras = {
    x: 1150,
    y: 100,
    ancho: 50,
    alto: 50
};

const cuadroScore = {
    x: 260,
    y: 0,
    ancho: 120,
    alto: 45
};

const cuadroVidas = {
    x: 390,
    y: 0,
    ancho: 85,
    alto: 45
};

const cuadroNombre = {
    x: 0,
    y: 0,
    ancho: 250,
    alto: 45
};

const cuadroTimer = {
    x: 500,
    y: 0,
    ancho: 150,
    alto: 45
};

function pedirNombreJugador() {
    const nombre = prompt("Por favor, ingresa tu nombre:");
    if (nombre) {
        jugador.nombre = nombre;
    }
}


function dibujarJugador() {
    ctx.beginPath();
    ctx.moveTo(jugador.x, jugador.y);
    ctx.lineTo(jugador.x - 40, jugador.y + 80);
    ctx.lineTo(jugador.x + 40, jugador.y + 80);
    ctx.closePath();
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
}

const jugadorImagen = new Image();
jugadorImagen.src = 'img/cupi.png'; // Cambia el nombre de archivo por el de tu imagen



function dibujarJugador() {
    ctx.drawImage(jugadorImagen, jugador.x - 40, jugador.y - 40, 120, 80); // Ajusta el tamaño y posición de la imagen

    if (showVelocity) {
        ctx.font = "60px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(jugador.velocidad, jugador.x + 40, jugador.y + 30);
    }
}

const cuadrosDeLetras = [];

for (let i = 0; i < 5; i++) {
    const cuadro = {
        x: Math.random() * (canvas.width - cuadroLetras.ancho),
        y: Math.random() * -canvas.height,
        ancho: cuadroLetras.ancho,
        alto: cuadroLetras.alto,
        color: getRandomColor(),
        letra: obtenerLetraAleatoria(),
        velocidadY: Math.random() * 1 + 1
    };
    cuadrosDeLetras.push(cuadro);
}

function dibujarCuadroDeLetras() {
    for (const cuadro of cuadrosDeLetras) {
        ctx.fillStyle = cuadro.color;
        ctx.fillRect(cuadro.x, cuadro.y, cuadro.ancho, cuadro.alto);

        ctx.font = "20px Arial";
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(cuadro.letra, cuadro.x + cuadro.ancho / 3, cuadro.y + cuadro.alto / 1.5);

        cuadro.y += cuadro.velocidadY;

        if (cuadro.y > canvas.height + cuadro.alto) {
            cuadro.y = -cuadro.alto;
            cuadro.x = Math.random() * (canvas.width - cuadro.ancho);
            cuadro.letra = obtenerLetraAleatoria(); // Cambiar la letra aleatoriamente
        }
    }
}

// Función para obtener una letra aleatoria
function obtenerLetraAleatoria() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Puedes ajustar las letras según tus preferencias
    const indice = Math.floor(Math.random() * letras.length);
    return letras[indice];
}



function dibujarMeteoritos() {
    for (const meteorito of meteoritos) {
        const distanciaX = Math.abs(jugador.x - meteorito.x);
        const distanciaY = Math.abs(jugador.y - meteorito.y);

        if (distanciaX < (jugadorImagen.width / 2 + meteorito.radio) && distanciaY < (jugadorImagen.height / 2 + meteorito.radio)) {
            // Restar una vida al jugador
            jugador.vidas--;

            // Reiniciar la posición del jugador
            jugador.x = canvas.width / 2;
            jugador.y = canvas.height - 100;

            // Comprobar si se agotaron las vidas
            if (jugador.vidas <= 0) {
                // Detener el juego
                clearInterval(timerInterval);
                alert("¡Has perdido! Tu puntuación final es: " + jugador.puntos);
                location.reload(); // Recargar la página para reiniciar el juego
            }
        }

        ctx.beginPath();
        ctx.arc(meteorito.x, meteorito.y, meteorito.radio, 0, Math.PI * 2);
        ctx.fillStyle = meteorito.color;
        ctx.fill();
        ctx.closePath();

        meteorito.y += meteorito.velocidadY;

        if (meteorito.y > canvas.height + meteorito.radio) {
            meteorito.y = -meteorito.radio;
            meteorito.x = Math.random() * canvas.width;
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

                // Crear una explosión de partículas en la posición de la colisión
                for (let i = 0; i < 10; i++) {
                    crearParticula(disparo.x, disparo.y);
                }

                // Eliminar el disparo
                disparos.splice(disparos.indexOf(disparo), 1);

                // Salir del bucle de comprobación de colisión
                break;
            }
        }

        // Eliminar el disparo si sale de la pantalla
        if (disparo.y < -disparo.radio) {
            disparos.splice(disparos.indexOf(disparo), 1);
        }
    }
}


// Función para crear una nueva partícula en la explosión
function crearParticula(x, y) {
    const particula = {
        x: x,
        y: y,
        velocidadX: Math.random() * 2 - 1,
        velocidadY: Math.random() * 2 - 1,
        vida: 30, // Tiempo de vida de la partícula
        color: getRandomColor(),
        radio: Math.random() * 3 + 1 // Tamaño aleatorio
    };
    particulas.push(particula);
}

// Función para actualizar las partículas en cada ciclo de actualización
function actualizarParticulas() {
    for (let i = particulas.length - 1; i >= 0; i--) {
        const particula = particulas[i];
        particula.x += particula.velocidadX;
        particula.y += particula.velocidadY;
        particula.vida--;
        if (particula.vida <= 0) {
            particulas.splice(i, 1); // Eliminar partícula
        }
    }
}

// Función para dibujar las partículas en la pantalla
function dibujarParticulas() {
    for (const particula of particulas) {
        ctx.beginPath();
        ctx.arc(particula.x, particula.y, particula.radio, 0, Math.PI * 2);
        ctx.fillStyle = particula.color;
        ctx.fill();
        ctx.closePath();
    }
}


function dibujarCuadros() {

    ctx.fillStyle = "#000000";
    ctx.fillRect(cuadroScore.x, cuadroScore.y, cuadroScore.ancho, cuadroScore.alto);

    ctx.fillStyle = "#000000";
    ctx.fillRect(cuadroVidas.x, cuadroVidas.y, cuadroVidas.ancho, cuadroVidas.alto);

    ctx.fillStyle = "#000000";
    ctx.fillRect(cuadroNombre.x, cuadroNombre.y, cuadroNombre.ancho, cuadroNombre.alto);
    
    ctx.fillStyle = "#000000";
    ctx.fillRect(cuadroTimer.x, cuadroTimer.y, cuadroTimer.ancho, cuadroTimer.alto);

    ctx.font = "20px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Score: " + jugador.puntos, cuadroScore.x + 10, cuadroScore.y + 30);
    ctx.fillText("Vidas: " + jugador.vidas, cuadroVidas.x + 10, cuadroVidas.y + 30);
    ctx.fillText("Nombre: " + jugador.nombre, cuadroNombre.x + 10, cuadroNombre.y + 30);
    ctx.fillText("Tiempo: " + jugador.timer, cuadroTimer.x + 10, cuadroTimer.y + 30);
    ctx.fillStyle = "#000000";
    ctx.fillText("A", cuadroLetras.x + 18, cuadroLetras.y + 30);
}

// Aqui podemos presionar varias teclas y funcionar, ejemplo movimiento y disparos.
const teclasPresionadas = {};

document.addEventListener("keydown", (event) => {
    teclasPresionadas[event.key.toLowerCase()] = true;

    if (event.key.toLowerCase() === "p" && debugMode) {
        showVelocity = !showVelocity;
    }
});

document.addEventListener("keyup", (event) => {
    teclasPresionadas[event.key.toLowerCase()] = false;
});

function actualizarJugador() {
    if (teclasPresionadas["a"] || teclasPresionadas["arrowleft"]) {
        if (jugador.x - jugador.velocidad >= 0) {
            jugador.x -= jugador.velocidad; // Mover a la izquierda
        }
    }
    if (teclasPresionadas["d"] || teclasPresionadas["arrowright"]) {
        if (jugador.x + jugador.velocidad <= canvas.width - 60) {
            jugador.x += jugador.velocidad; // Mover a la derecha
        }
    }
    if (teclasPresionadas[" "] || teclasPresionadas["w"] || teclasPresionadas["arrowup"]) {
        const disparo = {
            x: jugador.x,
            y: jugador.y,
            radio: 5,
            velocidad: 2,
            color: "red"
        };
        disparos.push(disparo);
    }
}

function dibujarEscena() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dibujarCuadros();
    dibujarJugador();
    dibujarMeteoritos();
    dibujarCorazones();
    dibujarDisparos();
    dibujarCuadroDeLetras();
    actualizarJugador();

    actualizarParticulas();
    dibujarParticulas();

    requestAnimationFrame(dibujarEscena);
}

function iniciarJuego() {
    
    jugador.vidas = 3; // Cambia el número de vidas según prefieras
    pedirNombreJugador(); // Llamamos a la función para pedir el nombre al inicio del juego

    for (let i = 0; i < 5; i++) {
        const meteorito = {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            radio: Math.random() * 20 + 10,
            velocidadY: Math.random() * 1 + 1,
            color: getRandomColor(),
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

    ctx.fillStyle = "black";
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

function iniciarJuego() {
    pedirNombreJugador(); // Llamamos a la función para pedir el nombre al inicio del juego

    for (let i = 0; i < 5; i++) {
        const meteorito = {
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            radio: Math.random() * 20 + 10,
            velocidadY: Math.random() * 1 + 1,
            color: getRandomColor(),
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

    
    // El contador de tiempo
    let tiempoRestante = 600; 

    const timerInterval = setInterval(() => {
        tiempoRestante--;
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        jugador.timer = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;

        if (tiempoRestante <= 0) {
            clearInterval(timerInterval); 
            alert("¡Tiempo agotado!");
        }
    }, 1000); 
}



