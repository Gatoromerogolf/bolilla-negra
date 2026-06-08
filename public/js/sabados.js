// Planilla de resultados generales de los sábados

// add read borders to all the divs
const divs = document.querySelectorAll("div[data-año]");
divs.forEach((div) => {
    div.style.border = "1px solid #ccc";
});

const div = document.querySelector("div[data-año]");
let año = div ? div.getAttribute("data-año") : null;
let resultados = [];
let fechas = [];


async function main() {
    resultados = await leerDatosNetos();
    if (!resultados || resultados.length === 0) {
        console.error("No se obtuvieron datos de leerDatosNetos o están vacíos.");
        return;
    }

    players2 = resultados

    fechas = await leerDatosFechas();

    // Crear un objeto para contar las celdas por cada mesFecha
    const mesesConteo = {};
    // Agrupar y contar las fechas por mesFecha
    fechas.forEach((fecha) => {
        const mes = fecha.mesFecha;
        if (!mesesConteo[mes]) {
            mesesConteo[mes] = 0;
        }
        mesesConteo[mes] += 1;
    });

    let diaJugadoRow = document.querySelector("#diaJugadoRow");
    let diaJugadoRow2 = document.querySelector("#diaJugadoRow2");
    let diaJugadoRow2Clau = document.querySelector("#diaJugadoRow2Clau");

    fechas.forEach((fecha) => {
        let newTd1 = document.createElement("td");
        newTd1.textContent = fecha.diafecha + "-" + fecha.mesFecha || "Sin fecha";
        newTd1.style.minWidth = "35px"; // Cambia el valor según tus necesidades
        // console.log(`Agregando diaJugado: ${fecha.diafecha}`);
        diaJugadoRow.appendChild(newTd1); // Agregar el nuevo td a la primera fila

        if (fecha.fec < 75) {
            let newTd2 = document.createElement("td");
            newTd2.textContent = fecha.diafecha + "-" + fecha.mesFecha || "Sin fecha";
            newTd2.style.minWidth = "35px"; // Cambia el valor según tus necesidades
            diaJugadoRow2.appendChild(newTd2); // Agregar el nuevo td a la segunda fila
        }

        if (fecha.fec > 74) {
            newTd2 = document.createElement("td");
            newTd2.textContent = fecha.diafecha + "-" + fecha.mesFecha || "Sin fecha";
            newTd2.style.minWidth = "35px"; // Cambia el valor según tus necesidades
            diaJugadoRow2Clau.appendChild(newTd2); // Agregar el nuevo td a la segunda fila
        }
    });
}

async function apertura() {

    players2ape = resultados.filter(
        (resultado) => resultado.fec > 60 && resultado.fec < 75
    );

    const filasMat = 50;
    let matriz2 = [];

    const playersData = {};
    let nptCount = {};

    // ==============================
    // AGRUPA DATOS
    // ==============================
    players2ape.forEach(({ play, fec, neto, anual, npt }) => {

        if (fec > 60 && fec < 75 && neto > 0) {

            if (!playersData[play]) {
                playersData[play] = [];
            }

            playersData[play].push({ fec, neto, anual });
        }

        // Cuenta NPT
        if (npt === 1) {
            if (!nptCount[play]) {
                nptCount[play] = 0;
            }
            nptCount[play]++;
        }
    });

    // ==============================
    // SELECCIONA LAS 6 MEJORES
    // ==============================
    for (const play in playersData) {

        playersData[play].sort((a, b) => a.neto - b.neto);
        playersData[play] = playersData[play].slice(0, 6);
        playersData[play].sort((a, b) => a.fec - b.fec);

        let sumaNetos = 0;

        playersData[play].forEach(obj => {
            sumaNetos += obj.neto;
        });

        let promedio = sumaNetos / playersData[play].length;
        let totalNpt = nptCount[play] || 0;

        promedio = parseFloat(promedio.toFixed(1));
        promedio += 2 * totalNpt;

        playersData[play].sumaNetos = sumaNetos;
        playersData[play].promedios = promedio;
        playersData[play].totalNpt = totalNpt;
    }

    // ==============================
    // MATRIZ ORIGINAL (NETO)
    // ==============================
    for (const play in playersData) {

        let fila = [];

        fila[0] = play;
        fila[1] = playersData[play].sumaNetos;
        fila[2] = playersData[play].promedios;
        fila[3] = playersData[play].totalNpt;

        playersData[play].forEach(({ fec, neto }) => {

            let col = fec + 3 - 60;

            while (fila.length <= col) {
                fila.push("--");
            }

            fila[col] = neto;
        });

        matriz2.push(fila);
    }

    matriz2.sort((a, b) => a[2] - b[2]);

    let tbody = document.querySelector("#tablaSeis2 tbody");

    matriz2.forEach(fila => {

        if (fila[1] > 0) {

            const row = tbody.insertRow();

            fila.forEach(valor => {

                const cell = row.insertCell(-1);
                cell.textContent = valor ?? "--";
                cell.style.width = "10px";

                if (valor === "--") {
                    cell.style.backgroundColor = "white";
                }
            });
        }
    });


};

async function clausura() {

    let players2Clau = resultados.filter(
        (resultado) => resultado.fec > 74 && resultado.fec < 90
    );

    const fechasFiltradasClau = fechas.filter(
        (fecha) => fecha.fec > 74 && fecha.fec < 90
    );

    const filasMat = 12;
    const columnas = 1;
    const matriz2 = new Array(filasMat)
        .fill(0)
        .map(() => new Array(columnas).fill(0));

    // Paso 1: Agrupar los datos por jugador, manteniendo solo pares de fec y neto
    const playersDataClau = {};

    players2Clau.forEach(({ play, fec, neto }) => {

        if (neto > 0) {
            // Filtra los pares donde neto es mayor a 0
            if (!playersDataClau[play]) {
                playersDataClau[play] = []; //Inicializ el arreglo para el jugador play asignándole un nuevo arreglo vacío.
            }
            playersDataClau[play].push({ fec, neto }); // Esto agrega un nuevo objeto al arreglo del jugador play. El objeto tiene dos propiedades: fec y neto.
        }
    });

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

    // :::::::::     LO GUARDA EN UNA MATRIZ
    // Crea una matriz para almacenar los resultados
    let matrizNpt = [];

    // Recorre el objeto nptCount para construir la matriz
    for (const play in nptCount) {
        if (nptCount.hasOwnProperty(play)) {
            matrizNpt.push([play, nptCount[play]]);
        }
    }

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

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //:::::::::::::: agrega suma netos y promedio
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    for (play in playersDataClau) {
        let sumaNetos = 0;
        let promedios = 0;
        for (let i = 0; i < playersDataClau[play].length; i++) {
            sumaNetos += playersDataClau[play][i].neto;
        }
        playersDataClau[play].sumaNetos = sumaNetos;
        promedios = sumaNetos / playersDataClau[play].length;

        // Agrega el total de npt del objeto nptCount
        playersDataClau[play].totalNpt = nptCount[play] || 0;

        let promedioDec = promedios.toFixed(1);
        // playersData[play].promedios = promedioDec;

        let sumar = 2 * playersDataClau[play].totalNpt;
        // Asegúrate de que promedioDec sea un número
        promedioDec = parseFloat(promedioDec) || 0; // Esto asegura que promedioDec sea un número
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

            // la columna es la fecha menos 71, porque tengo que dejar las primeras 4 columnas para nombre, ptos, prom y NPT
            let col = playersDataClau[elemento][j].fec - 71;

            // Si `col` es mayor que la longitud actual del array, puedes ajustar el array.
            while (matriz2[i].length <= col) {
                matriz2[i].push("--"); // Rellena con `null` o cualquier valor por defecto
            }

            // Luego agrega el valor deseado
            matriz2[i][col] = playersDataClau[elemento][j].neto;
        }
        i++;
    }

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
};


main().then(() => {
    // Ejecuta la función principal
    let tabla = document.getElementById("miTabla");
    const sumaGolpes = [];
    const cantidadTarjetas = [];
    const primeraPosicion = [];
    const segundaPosicion = [];
    const terceraPosicion = [];
    const pelotasGanadas = [];
    const totalPremios = [];
    const totalNPT = [];
    for (let i = 0; i < 12; i++) {
        sumaGolpes.push(0);
        cantidadTarjetas.push(0);
        pelotasGanadas.push(0);
        primeraPosicion.push(0);
        segundaPosicion.push(0);
        terceraPosicion.push(0);
        totalPremios.push(0);
        totalNPT.push(0);
    }

    const filas = tabla.getElementsByTagName("tr");

    for (const player of players2) {
        const textoBuscado = player.play;

        for (let i = 1; i < filas.length; i++) {
            const celdaPrimera = filas[i].getElementsByTagName("td")[0];
            if (celdaPrimera) {
                const contenidoCelda = celdaPrimera.textContent;
                if (contenidoCelda === textoBuscado) {
                    const filaEncontrada = filas[i];
                    let nuevaCelda = filaEncontrada.insertCell(-1);
                    switch (player.pos) {
                        case 1:
                            nuevaCelda.textContent = player.neto + 900;
                            break;
                        case 2:
                            nuevaCelda.textContent = player.neto + 800;
                            break;
                        case 3:
                            nuevaCelda.textContent = player.neto + 700;
                            break;
                        default:
                            nuevaCelda.textContent = player.neto;
                            nuevaCelda.textContent = player.npt == 1 ? "NPT" : player.neto;
                            break;
                    }

                    sumaGolpes[i - 2] = (sumaGolpes[i - 2] || 0) + player.neto;
                    totalNPT[i - 2] += player.npt;
                    pelotasGanadas[i - 2] += player.pg;
                    if (player.neto != 0) {
                        cantidadTarjetas[i - 2]++;
                    }

                    switch (player.pos) {
                        case 1:
                            primeraPosicion[i - 2]++;
                            totalPremios[i - 2]++;
                            break;
                        case 2:
                            segundaPosicion[i - 2]++;
                            totalPremios[i - 2]++;
                            break;
                        case 3:
                            terceraPosicion[i - 2]++;
                            totalPremios[i - 2]++;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    //   agrega columnas con el score de la fecha
    for (let i = 0; i < 12; i++) {
        const celdaTotalPremios = filas[i + 2].insertCell(1);
        celdaTotalPremios.textContent = `${totalPremios[i]}`;

        const celdaPrimeraPosicion = filas[i + 2].insertCell(2);
        celdaPrimeraPosicion.textContent = `${primeraPosicion[i]}`;

        const celdaSegundaPosicion = filas[i + 2].insertCell(3);
        celdaSegundaPosicion.textContent = `${segundaPosicion[i]}`;

        const celdaTerceraPosicion = filas[i + 2].insertCell(4);
        celdaTerceraPosicion.textContent = `${terceraPosicion[i]}`;

        const celdaPelotasGanadas = filas[i + 2].insertCell(5);
        celdaPelotasGanadas.textContent = `${pelotasGanadas[i]}`;

        const celdaCtdd = filas[i + 2].insertCell(6);
        celdaCtdd.textContent = `${cantidadTarjetas[i]}`;

        const celdaSuma = filas[i + 2].insertCell(7);
        celdaSuma.textContent = sumaGolpes[i];

        const promedio = filas[i + 2].insertCell(8);
        let resultado = sumaGolpes[i] / cantidadTarjetas[i];
        resultado += totalNPT[i] * 2;

        let resultadoFormateado = resultado.toFixed(1);

        // promedio.textContent = resultadoFormateado;
        promedio.textContent =
            resultadoFormateado == "NaN" ? "--" : resultadoFormateado;
    }

    // crea una matriz vacia
    const matriz = [];

    // llena todas las filas de matriz con los datos completos
    tabla.querySelectorAll("tr").forEach((fila) => {
        const filaMatriz = [];
        // Recorrer las celdas de la fila
        fila.querySelectorAll("td").forEach((celda) => {
            filaMatriz.push(celda.textContent);
        });
        matriz.push(filaMatriz);
    });

    matriz.sort(compararPorColumna9);

    // Llamada al método sort() con la función de comparación

    // Función de comparación para ordenar por la columna 9 (índice 8)
    function compararPorColumna9(filaA, filaB) {
        const valorA = parseFloat(filaA[8]);
        const valorB = parseFloat(filaB[8]);
        // return valorA - valorB;
        // const valorA = parseFloat(filaA[8].replace(",", ".")) || 0;
        // const valorB = parseFloat(filaB[8].replace(",", ".")) || 0;
        return valorA - valorB;
    }

    // Crear una copia de la matriz original
    // const matrizCopia = matriz.map((fila) => [...fila]);

    for (let i = 0; i < matriz.length; i++) {
        // Crea una nueva fila vacía
        filas[i] = [];
        filas[i] = matriz[i];

        // Reemplazar las filas desordenadas en la matriz original
        for (let i = 0; i < matriz.length; i++) {
            filas[i] = [];
            // Copia los valores de la matriz original a la nueva fila
            for (let j = 0; j < matriz[i].length; j++) {
                filas[i][j] = matriz[i][j];
            }
        }
    }

    // 🏐🏐🏐:: Ahora matrizOriginal contiene las filas ordenadas
    let tablaOrdenada = document.getElementById("tablaOrdenada");
    const filasOrdenadas = tablaOrdenada.getElementsByTagName("tr");

    // Reemplazar las filas desordenadas en la matriz original
    for (let i = 0; i < matriz.length - 2; i++) {
        // Crea una nueva fila vacía

        filasOrdenadas[i + 2] = [];
        const celdaPrimeraOrd = filasOrdenadas[i + 2].getElementsByTagName("td")[0];
        celdaPrimeraOrd.textContent = matriz[i + 2][0];

        // Copia los valores de la matriz original a la nueva fila
        for (let j = 1; j < matriz[i + 2].length; j++) {
            /*filasOrdenadas[i][j] = matriz[i][j];*/
            const cel01 = filasOrdenadas[i + 2].insertCell();

            if (j > 8) {
                if (matriz[i + 2][j] > 900) {
                    matriz[i + 2][j] -= 900;
                    //cel01.textContent = matriz[i + 2][j];
                    cel01.style.color = "rgb(255, 0, 0)";
                    cel01.style.fontWeight = "bold";
                } else if (matriz[i + 2][j] > 800) {
                    matriz[i + 2][j] -= 800;
                    //cel01.textContent = matriz[i + 2][j];
                    cel01.style.color = "rgb(0, 0, 255)";
                    cel01.style.fontWeight = "bold";
                } else if (matriz[i + 2][j] > 700) {
                    matriz[i + 2][j] -= 700;
                    //cel01.textContent = matriz[i + 2][j];
                    //cel01.style.color = "rgb(226, 144, 22)";
                    cel01.style.color = "rgb(10, 172, 27)";
                    cel01.style.fontWeight = "bold";
                }
            }

            cel01.textContent = matriz[i + 2][j];

            //  setea colores grises y 1, 2 y 3
            if (matriz[i + 2][j] === "0") {
                cel01.textContent = "-";
                cel01.style.backgroundColor = "rgb(253, 235, 208)";
                cel01.style.backgroundColor = "rgb(196, 197, 194)";
                cel01.style.backgroundColor = "rgb(216, 218, 214)";
            }

            if (j === 2 && cel01.textContent !== "-") {
                cel01.style.color = "rgb(255, 0, 0)";
                cel01.style.fontWeight = "bold";
            }

            if (j === 3 && cel01.textContent !== "-") {
                cel01.style.color = "rgb(0, 0, 255)";
                cel01.style.fontWeight = "bold";
            }

            if (j === 4 && cel01.textContent !== "-") {
                cel01.style.color = "rgb(10, 172, 27)";
                cel01.style.fontWeight = "bold";
            }
        }
    }

    // 🏐🏐🏐:: pone total de jugadores
    let filaTotalJugadores = document.getElementById("totalJug");

    fechas.forEach((fecha) => {
        const totalDia = filaTotalJugadores.insertCell(-1);
        totalDia.textContent = fecha.jugadores;
    });

    clausura();
    apertura();

}); //  aca termina la funcion principal


// 🎪🥎🏀🏆🎪🥎🏀🏆:: leer Datos Netos
async function leerDatosNetos() {
    try {
        const response = await fetch(`/leerDatosNetos`);
        if (response.ok) {
            const resultados = await response.json();
            const resultadosFiltrados = resultados.filter((resultado) => resultado.fec > 60);
            return resultadosFiltrados; // Devuelve los datos obtenidos si la respuesta es exitosa
        } else {
            console.error(
                "Error en la respuesta:",
                response.status,
                response.statusText,
            );
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
    }
}


// 🎪🥎🏀🏆🎪🥎🏀🏆:: leer Datos Fechas
async function leerDatosFechas() {
    try {
        const response = await fetch(`/leerDatosFechas`);
        if (response.ok) {
            const fechas = await response.json();
            const fechasFiltradas = fechas.filter(
                (fecha) => fecha.fec > 60 && fecha.fec < 90,
            );
            return fechasFiltradas; // Devuelve las fechas filtradas con diaJugado
        } else {
            console.error(
                "Error en la respuesta:",
                response.status,
                response.statusText,
            );
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
    }
}
