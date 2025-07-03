// let año = "2025";

let players2Clau = [];

async function main() {
    const resultadosClau = await leerDatosNetos();
    if (!resultadosClau || resultadosClau.length === 0) {
        console.error("No se obtuvieron datos de leerDatosNetos o están vacíos.");
        return;
    }

    if (año === "2025") {
        players2Clau = resultadosClau.filter(
            (resultado) => resultado.fec > 44 && resultado.fec < 90
        );
    } else {
        players2Clau = resultadosClau.filter((resultado) => resultado.fec < 32);
    }
    const fechasFiltradasClau = await leerDatosFechasClau();
    console.table(fechasFiltradasClau);
}

main().then(() => {

    console.log("players2Clau");
    console.table(players2Clau);

    const filasMat = 12;
    const columnas = 1;
    const matriz2 = new Array(filasMat)
        .fill(0)
        .map(() => new Array(columnas).fill(0));

    // Paso 1: Agrupar los datos por jugador, manteniendo solo pares de fec y neto
    const playersDataClau = {};

    players2Clau.forEach(({ play, fec, neto }) => {
        if (fec > 44 && fec < 90) {
            if (neto > 0) {
                // Filtra los pares donde neto es mayor a 0
                if (!playersDataClau[play]) {
                    playersDataClau[play] = []; //Inicializ el arreglo para el jugador play asignándole un nuevo arreglo vacío.
                }
                playersDataClau[play].push({ fec, neto }); // Esto agrega un nuevo objeto al arreglo del jugador play. El objeto tiene dos propiedades: fec y neto.
            }
        }
    });

    // :::::::::::::::::::::::::::::::::::::::::::::
    // ::::::::: CUENTA EL TOTAL DE NPT DE CADA UNO
    // :::::::::::::::::::::::::::::::::::::::::::::

    let nptCount = {};

    // Recorre players2 y cuenta las veces que npt es 1 para cada play
    players2Clau.forEach(({ play, npt }) => {
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
    for (const play in playersDataClau) {
        playersDataClau[play].sort((a, b) => a.neto - b.neto);
        playersDataClau[play] = playersDataClau[play].slice(0, 6);
        playersDataClau[play].sort((a, b) => a.fec - b.fec);
    }
    console.log("tabla con players");
    console.table(playersDataClau);

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::::::::::::: agrega suma netos y promedio
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    for (const play in playersDataClau) {
        let sumaNetos = 0;
        let promedios = 0;
        for (let i = 0; i < playersDataClau[play].length; i++) {
            sumaNetos += playersDataClau[play][i].neto;
        }
        playersDataClau[play].sumaNetos = sumaNetos;
        promedios = sumaNetos / playersDataClau[play].length;

        // Agrega el total de npt del objeto nptCount
        playersDataClau[play].totalNpt = nptCount[play] || 0;

        let promedioDec = parseFloat(promedios.toFixed(1));
        // playersData[play].promedios = promedioDec;

        let sumar = 2 * playersDataClau[play].totalNpt;
        // Asegúrate de que promedioDec sea un número
        // promedioDec = parseFloat(promedioDec) || 0; // Esto asegura que promedioDec sea un número
        promedioDec += sumar;

        playersDataClau[play].promedios = promedioDec;
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::::::::::::: ordena por promedio ascendente
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::

    for (const key in playersDataClau) {
        if (Array.isArray(playersDataClau[key])) {
            playersDataClau[key].sort((a, b) => a.promedios - b.promedios);
        }
    }
    //

    let i = 0;
    let j = 0;

    for (const play in playersDataClau) {
        matriz2[i][0] = play;
        matriz2[i][1] = playersDataClau[play].sumaNetos;
        matriz2[i][2] = playersDataClau[play].promedios;
        matriz2[i][3] = playersDataClau[play].totalNpt;
        i++;
    }

    i = 0;
    let col = 0;

    for (const elemento in playersDataClau) {
        // Asegura que haya una fila en la matriz para este índice
        matriz2[i] = matriz2[i] || [];

        for (let j = 0; j < playersDataClau[elemento].length; j++) {
            console.log(
                `j: ${j}, elemento ${elemento} y otro ${playersDataClau[elemento][j].fec}`
            );
            let col = playersDataClau[elemento][j].fec - 41;

            // Si `col` es mayor que la longitud actual del array, puedes ajustar el array.
            while (matriz2[i].length <= col) {
                matriz2[i].push("--"); // Rellena con `null` o cualquier valor por defecto
            }

            // Luego agrega el valor deseado
            matriz2[i][col] = playersDataClau[elemento][j].neto;
        }
        i++;
    }
    console.log("matriz ordenada");
    console.table(matriz2);
    matriz2.sort((filaA, filaB) => filaA[2] - filaB[2]);

    // Selecciona el tbody donde se agregarán las filas
    //   let tbody = document.querySelector("#tablaSeis2Clau tbody");

    //   let lineaDatos2 = document.getElementById("lineaScore2Clau");

    // Agrega el nombre del grupo como la primera celda
    for (i = 0; i < 12; i++) {
        if (matriz2[i][1] > 0) {
            const lineaDatos2 = tablaSeis2Clau.insertRow();
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

// :::::::::::::::::::::::::::::::::::
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
async function leerDatosFechasClau() {
    try {
        const responseC = await fetch(`/leerDatosFechas`);
        if (responseC.ok) {
            const fechasClau = await responseC.json();
            const fechasFiltradasClau = fechasClau.filter(
                (fecha) => fecha.fec > 44 && fecha.fec < 90
            );
            return fechasFiltradasClau;
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
