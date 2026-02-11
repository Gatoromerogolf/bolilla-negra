// let año = "2025";
async function main() {
    const resultados = await leerDatosNetos();
    if (!resultados || resultados.length === 0) {
        console.error("No se obtuvieron datos de leerDatosNetos o están vacíos.");
        return;
    }

    // if (año === "2025") {
    //     players2 = resultados.filter(
    //         (resultado) => resultado.fec > 31 && resultado.fec < 46
    //     );
    // } else {
    //     players2 = resultados.filter((resultado) => resultado.fec < 32);
    // }

    players2 = resultados.filter((resultado) => resultado.fec > 31 && resultado.fec < 60);

    fechas = await leerDatosFechas();
}

main().then(() => {

    const filasMat = 12;
    const columnas = 1;
    const matriz2 = new Array(filasMat)
        .fill(0)
        .map(() => new Array(columnas).fill(0));

    // Paso 1: Agrupar los datos por jugador, manteniendo solo pares de fec y neto
    const playersData = {};

    //if (!playersData[play]): verifica si no existe ningún dato para el jugador con índice play en el arreglo playersData. El ! antes de playersData[play] verifica si es falso, es decir, si es nulo, undefined, 0, false o una cadena vacía.

    players2.forEach(({ play, fec, neto }) => {
        if (fec > 31 && fec < 45) {
            if (neto > 0) {
                // Filtra los pares donde neto es mayor a 0
                if (!playersData[play]) {
                    playersData[play] = []; //Inicializ el arreglo para el jugador play asignándole un nuevo arreglo vacío.
                }
                playersData[play].push({ fec, neto }); // Esto agrega un nuevo objeto al arreglo del jugador play. El objeto tiene dos propiedades: fec y neto.
            }
        }
    });

    // :::::::::::::::::::::::::::::::::::::::::::::
    // ::::::::: CUENTA EL TOTAL DE NPT DE CADA UNO
    // :::::::::::::::::::::::::::::::::::::::::::::

    let nptCount = {};

    // Recorre players2 y cuenta las veces que npt es 1 para cada play
    players2.forEach(({ play, npt }) => {
        // Si npt es 1, incrementa el contador para ese jugador (play)
        if (npt === 1) {
            if (!nptCount[play]) {
                nptCount[play] = 0; // Inicializa si no existe
            }
            nptCount[play] += 1; // Incrementa el contador de npt
        }
    });

    // ::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::     LO GUARDA EN UNA MATRIZ
    // ::::::::::::::::::::::::::::::::::::::::::::::
    // Crea una matriz para almacenar los resultados
    let matrizNpt = [];

    // Recorre el objeto nptCount para construir la matriz
    for (const play in nptCount) {
        if (nptCount.hasOwnProperty(play)) {
            matrizNpt.push([play, nptCount[play]]);
        }
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::::::::::::: selecciona los seis mejores
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // ordena por score neto de menor a mayor
    // Slice devuelve una copia de una porción del arreglo.  Toma los seis primeros
    //ordena los 6 por fec para presentarlo por fecha
    for (const play in playersData) {
        playersData[play].sort((a, b) => a.neto - b.neto);
        playersData[play] = playersData[play].slice(0, 6);
        playersData[play].sort((a, b) => a.fec - b.fec);
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::::::::::::: agrega suma netos y promedio
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    for (play in playersData) {
        let sumaNetos = 0;
        let promedios = 0;
        for (let i = 0; i < playersData[play].length; i++) {
            sumaNetos += playersData[play][i].neto;
        }
        playersData[play].sumaNetos = sumaNetos;
        promedios = sumaNetos / playersData[play].length;

        // Agrega el total de npt del objeto nptCount
        playersData[play].totalNpt = nptCount[play] || 0;

        let promedioDec = promedios.toFixed(1);
        // playersData[play].promedios = promedioDec;

        let sumar = 2 * playersData[play].totalNpt;
        // Asegúrate de que promedioDec sea un número
        promedioDec = parseFloat(promedioDec) || 0; // Esto asegura que promedioDec sea un número
        promedioDec += sumar;

        playersData[play].promedios = promedioDec;
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::::::::::::: ordena por promedio ascendente
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::

    for (const key in playersData) {
        if (Array.isArray(playersData[key])) {
            playersData[key].sort((a, b) => a.promedios - b.promedios);
        }
    }
    //

    i = 0;
    j = 0;

    for (const play in playersData) {
        matriz2[i][0] = play;
        matriz2[i][1] = playersData[play].sumaNetos;
        matriz2[i][2] = playersData[play].promedios;
        matriz2[i][3] = playersData[play].totalNpt;
        i++;
    }

    i = 0;
    let col = 0;

    for (const elemento in playersData) {
        // Asegura que haya una fila en la matriz para este índice
        matriz2[i] = matriz2[i] || [];

        for (let j = 0; j < playersData[elemento].length; j++) {
            let col = playersData[elemento][j].fec + 3 - 31;

            // Si `col` es mayor que la longitud actual del array, puedes ajustar el array.
            while (matriz2[i].length <= col) {
                matriz2[i].push("--"); // Rellena con `null` o cualquier valor por defecto
            }

            // Luego agrega el valor deseado
            matriz2[i][col] = playersData[elemento][j].neto;
        }
        i++;
    }

    matriz2.sort((filaA, filaB) => filaA[2] - filaB[2]);

    // Selecciona el tbody donde se agregarán las filas
    let tbody = document.querySelector("#tablaSeis2 tbody");

    let lineaDatos2 = document.getElementById("lineaScore2");

    // Agrega el nombre del grupo como la primera celda
    for (i = 0; i < 12; i++) {
        if (matriz2[i][1] > 0) {
            const lineaDatos2 = tablaSeis2.insertRow();
            // for (j = 0; j < 13; j++) {
            for (j = 0; j < matriz2[i].length; j++) {
                if (matriz2[i][j] == 0) {
                    matriz2[i][j] = "--";
                }
                const celdagral = lineaDatos2.insertCell(-1);
                celdagral.style.width = "10px";
                celdagral.textContent = matriz2[i][j];
                if (matriz2[i][j] == "--") {
                    celdagral.style.backgroundColor = "white";
                }
            }
        }
    }
});

// :::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::: leer datos Netos
// :::::::::::::::::::::::::::::::::::::::::::::::

async function leerDatosNetos() {
    try {
        const response = await fetch(`/leerDatosNetos`);
        if (response.ok) {
            const resultados = await response.json();
            return resultados; // Devuelve los datos obtenidos si la respuesta es exitosa
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

// :::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::: leer datos Fechas
// :::::::::::::::::::::::::::::::::::::::::::::::
async function leerDatosFechas() {
    try {
        const response = await fetch(`/leerDatosFechas`);
        if (response.ok) {
            const fechas = await response.json();
            const fechasFiltradas = fechas.filter(
                (fecha) => fecha.fec > 31 && fecha.fec < 90
            );
            return fechasFiltradas;
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
