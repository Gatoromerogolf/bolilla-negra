// Planilla de resultados generales de los sábados

// desde el html que invoca se pasa el parametro con data-año
// <div  data-año="2025">
//     <script src="../js/sabados.js"></script>  
//</div> */}

let año = "2025" // el año que viene cambiamos
let players2 = [];
let giras = [];

async function main() {
    const resultados = await leerDatosNetos();
    giras = await leerDatosGiras();
    if (!resultados || resultados.length === 0) {
        console.error("No se obtuvieron datos de leerDatosNetos o están vacíos.");
        return;
    }

    if (año === "2025") {
        players2 = resultados.filter((resultado) => resultado.fec > 31);
    } else {
        players2 = resultados.filter((resultado) => resultado.fec < 32);
    }

    fechas = await leerDatosFechas();
}

main().then(() => {

    let matrizValores = Array.from({ length: 12 }, () => ["", 0]); // Cada fila tendrá un arreglo con valores iniciales

    // const sumaPuntos = [];
    // const sumaSabados = [];
    // const sumaSierra = [];
    // const sumaRyder = [];
    // const sumaApertura = [];
    // const sumaClausura = [];
    // const sumaCarilo = [];
    // const sumaDesafio = [];

    //  Arma la matriz con los nombres de los jugadores
    //  suma los valores anuales obtenidos en cada sábado
    for (const player of players2) {
        if (player.play !== "Presi") {
        const textoBuscado = player.play;
        for (let i = 0; i < 12; i++) {
            if (matrizValores[i][1] == textoBuscado) {
                matrizValores[i][3] += player.anual;
                break;
            } else if
                (matrizValores[i][1] == "" || matrizValores[i][1] == undefined) {
                matrizValores[i][1] = textoBuscado;
                matrizValores[i][3] = player.anual;
                break; // Sal del loop después de asignar y sumar
            }
        }}
    }

    //  leo el localstorage con los puntos por mejor score mensual.
    const ganadoresScore = localStorage.getItem('ganadoresScore');
    if (ganadoresScore) {
        const matrizGanadoresScore = JSON.parse(ganadoresScore);
        for (let i = 0; i < 12; i++) { // borrra los acumuladores
            matrizValores[i][4] = 0;
        }
        matrizGanadoresScore.forEach(ganador => {
            const player = ganador[0];
            const puntos = parseFloat(ganador[1]);

            for (let i = 0; i < 12; i++) {
                if (matrizValores[i][1] == player) {
                    matrizValores[i][4] = (parseFloat(matrizValores[i][4]) || 0) + puntos;
                }
            }
        })
    }

    //  tengo que agregar a la matriz los valores de las giras y torneos
    for (const jugador of giras) {
        const textoBuscado = jugador.Jugador;
        for (let i = 0; i < 12; i++) {
            if (matrizValores[i][1] == textoBuscado) {
                matrizValores[i][5] = parseFloat(jugador.Sierra);
                matrizValores[i][6] = jugador.Ryder;
                matrizValores[i][9] = jugador.Carilo;
                matrizValores[i][10] = jugador.Desafio;

                matrizValores[i][7] = parseFloat(jugador.Apertura);
                matrizValores[i][8] = parseFloat(jugador.Clausura);
                break;
            }
        }
    }

    for (let i = 0; i < 11; i++) {
        // Asegurate de que empiece en número (y no en undefined o string)
        matrizValores[i][2] = 0;
    
        for (let j = 3; j < 11; j++) {
            const valor = matrizValores[i][j];
            // esto por si hay algun valor NaN
            if (isNaN(valor)) {
                console.warn(`Valor inválido en matrizValores[${i}][${j}]:`, valor);
            } else {
                matrizValores[i][2] += valor;
            }
        }
    }
    

    // Llamada al método sort() con la función de comparación
    matrizValores.sort(compararPorColumna2);

    // Función de comparación para ordenar por la columna 2
    function compararPorColumna2(filaA, filaB) {
        const valorA = parseFloat(filaA[2]);
        const valorB = parseFloat(filaB[2]);
        return valorB - valorA;
    }
    for (let i = 0; i < 12; i++) {
        matrizValores[i][0] = i + 1;
    }


    let tablaAnual = document.getElementById("tablaAnual");
    let tbody = tablaAnual.querySelector("tbody"); // Selecciona el tbody de la tabla

    // Limpia cualquier fila existente en tbody
    tbody.innerHTML = "";

    // Itera sobre los valores de la matriz y crea filas y celdas
    for (let i = 0; i < matrizValores.length; i++) {
        let fila = tbody.insertRow(); // Crea una nueva fila

        // Itera sobre cada valor en la fila de la matriz y crea celdas
        for (let j = 0; j < matrizValores[i].length; j++) {
            let celda = fila.insertCell(j); // Crea una nueva celda en la posición j
            if (j === 3) {
                // Crea un enlace en la celda de la posición 3
                let enlace = document.createElement("a");
                enlace.href = `transation-detail.html?player=${encodeURIComponent(matrizValores[i][1])}`;
                enlace.textContent = matrizValores[i][j];
                celda.appendChild(enlace);
            } else {
                celda.textContent = matrizValores[i][j]; // Asigna el valor a la celda
            }
        }
    }
})

async function leerDatosNetos() {
    try {
        const response = await fetch(`/leerDatosNetos`);
        if (response.ok) {
            const resultados = await response.json();
            return resultados;
        } else {
            console.error(
                "Error en la respuesta:",
                response.status,
                response.statusText
            );
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
    }
}

async function leerDatosFechas() {
    try {
        const response = await fetch(`/leerDatosFechas`);
        if (response.ok) {
            const fechas = await response.json();
            const fechasFiltradas = fechas.filter(
                (fecha) => fecha.fec > 31 && fecha.fec < 90
            );

            return fechasFiltradas; // Devuelve las fechas filtradas con diaJugado
        } else {
            console.error(
                "Error en la respuesta:",
                response.status,
                response.statusText
            );
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
    }
}

async function leerDatosGiras() {
    try {
        const results = await fetch(`/leerDatosGiras`);
        if (results.ok) {
            const resultadosGira = await results.json();
            return resultadosGira;
        } else {
            console.error(
                "Error en la respuesta:",
                results.status,
                results.statusText
            );
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud lectura Gira:", error);
        return null;
    }
}