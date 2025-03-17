// Planilla de resultados generales de los sábados

// desde el html que invoca se pasa el parametro con data-año
// <div  data-año="2025">
//     <script src="../js/sabados.js"></script>  
//</div> */}

// const div = document.querySelector("div[data-año]");
// let año = div ? div.getAttribute("data-año") : null;

let año = "2025" // el año que viene cambiamos

async function main() {
    const resultados = await leerDatosNetos();
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
    // Ejecuta la función principal

    // let tabla = document.getElementById("miTabla");

    let matrizValores = Array.from({ length: 12 }, () => ["", 0]); // Cada fila tendrá un arreglo con valores iniciales

    const sumaPuntos = [];
    const sumaSabados = [];
    const sumaSierra = [];
    const sumaRyder = [];
    const sumaApertura = [];
    const sumaClausura = [];
    const sumaCarilo = [];
    const sumaDesafio = [];

    //  Arma la matriz con los nombres de los jugadores
    //  suma los valores anuales obtenidos en cada sábado
    for (const player of players2) {
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
        }
    }

    //  leo el localstorage con los puntos por mejor score mensual.
    const ganadoresScore = localStorage.getItem('ganadoresScore');
    if (ganadoresScore) {
        const matrizGanadoresScore = JSON.parse(ganadoresScore);
        console.log(`matriz ganadores score ${matrizGanadoresScore}`); // [ ["player1", 10], ["player2", 15], ["player3", 20] ]
        for (let i = 0; i < 12; i++) { // borrra los acumuladores
            matrizValores[i][4] = 0;}
        matrizGanadoresScore.forEach (ganador => {
            const player = ganador [0];
            const puntos = parseFloat(ganador [1]); 

            for (let i = 0; i < 12; i++) {
                if (matrizValores[i][1] == player) {
                    matrizValores[i][4] = (parseFloat(matrizValores[i][4]) || 0) + puntos;
                    }
            }
        })
    }

    for (let i = 0; i < 12; i++) {
    matrizValores[i][2] = matrizValores[i][3] + matrizValores[i][4];
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
        matrizValores[i][0] = i+1;
    }

    console.table(matrizValores);

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
    console.log("entro a leer datosfechas");
    try {
        const response = await fetch(`/leerDatosFechas`);
        if (response.ok) {
            const fechas = await response.json();
            console.log(fechas[0]);

            const fechasFiltradas = fechas.filter(
                (fecha) => fecha.fec > 31 && fecha.fec < 90
            );
            console.log(`primera filtrada: ${JSON.stringify(fechasFiltradas[0])}`); // Muestra la primera fecha filtrada

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
