async function main() {
    const resultados = await leerDatosNetos();
    if (!resultados || resultados.length === 0) {
        console.error("No se obtuvieron datos.");
        return;
    }

    players2 = resultados.filter(
        (resultado) => resultado.fec > 60 && resultado.fec < 90
    );

    fechas = await leerDatosFechas();
}

main().then(() => {

    const filasMat = 50;
    let matriz2 = [];

    const playersData = {};
    let nptCount = {};

    // ==============================
    // AGRUPA DATOS
    // ==============================
    players2.forEach(({ play, fec, neto, anual, npt }) => {

        if (fec > 60 && fec < 90 && neto > 0) {

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

    // =========================================================
    // =========================================================
    // NUEVA MATRIZ ANUAL
    // =========================================================
    // =========================================================

    // let matrizAnual = [];

    // for (const play in playersData) {

    //     let fila = [];
    //     let sumaAnual = 0;

    //     fila[0] = play;

    //     playersData[play].forEach(({ fec, anual }) => {

    //         sumaAnual += anual;

    //         let col = fec + 3 - 31;

    //         while (fila.length <= col) {
    //             fila.push("--");
    //         }

    //         fila[col] = anual;
    //     });

    //     fila[1] = sumaAnual;

    //     matrizAnual.push(fila);
    // }

    // ORDEN DESCENDENTE
    // matrizAnual.sort((a, b) => b[1] - a[1]);

    // let tbodyAnual = document.querySelector("#tablaAnual tbody");

    // matrizAnual.forEach(fila => {

    //     if (fila[1] > 0) {

    //         const row = tbodyAnual.insertRow();

    //         fila.forEach(valor => {

    //             const cell = row.insertCell(-1);
    //             cell.textContent = valor ?? "--";

    //             if (valor === "--") {
    //                 cell.style.backgroundColor = "white";
    //             }
    //         });
    //     }
    // });
});


// =====================================
// LEER DATOS
// =====================================

async function leerDatosNetos() {
    try {
        const response = await fetch(`/leerDatosNetos`);
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function leerDatosFechas() {
    try {
        const response = await fetch(`/leerDatosFechas`);
        if (response.ok) {
            const fechas = await response.json();
            return fechas.filter(
                (fecha) => fecha.fec > 60 && fecha.fec < 90
            );
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}