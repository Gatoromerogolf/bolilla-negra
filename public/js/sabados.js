// Planilla de resultados generales de los sábados
const div = document.querySelector("div[data-año]");
let año = div ? div.getAttribute("data-año") : null;

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

    // Actualizar las celdas con el colspan correspondiente
    // Object.keys(mesesConteo).forEach((mes, index) => {
    //     // Seleccionar la celda de la fila superior correspondiente al mes actual
    //     const mesTh = document.querySelectorAll("th[colspan]")[index];
        
    //     if (mesTh) {
    //         mesTh.textContent = `Mes ${mes}`; // Opcional: actualizar el texto del encabezado
    //         mesTh.setAttribute("colspan", mesesConteo[mes]);
    //     }
    // });

    let diaJugadoRow = document.querySelector("#diaJugadoRow"); 
    let diaJugadoRow2 = document.querySelector("#diaJugadoRow2");

fechas.forEach((fecha) => {
    let newTd1 = document.createElement("td");
    newTd1.textContent = fecha.diafecha + "-" + fecha.mesFecha || "Sin fecha";
    newTd1.style.minWidth = "35px"; // Cambia el valor según tus necesidades
    // console.log(`Agregando diaJugado: ${fecha.diafecha}`);
    diaJugadoRow.appendChild(newTd1); // Agregar el nuevo td a la primera fila

    let newTd2 = document.createElement("td");
    newTd2.textContent = fecha.diafecha + "-" + fecha.mesFecha || "Sin fecha";
    newTd2.style.minWidth = "35px"; // Cambia el valor según tus necesidades
    diaJugadoRow2.appendChild(newTd2); // Agregar el nuevo td a la segunda fila
});
}

main().then(() => { // Ejecuta la función principal

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
                        case 1: nuevaCelda.textContent = player.neto + 900; break;
                        case 2: nuevaCelda.textContent = player.neto + 800; break;
                        case 3: nuevaCelda.textContent = player.neto + 700; break;
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
                        case 1: primeraPosicion[i - 2]++; totalPremios[i - 2]++; break;
                        case 2: segundaPosicion[i - 2]++; totalPremios[i - 2]++; break;
                        case 3: terceraPosicion[i - 2]++; totalPremios[i - 2]++; break;
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
        celdaTotalPremios.textContent = totalPremios[i];

        const celdaPrimeraPosicion = filas[i + 2].insertCell(2);
        celdaPrimeraPosicion.textContent = primeraPosicion[i];

        const celdaSegundaPosicion = filas[i + 2].insertCell(3);
        celdaSegundaPosicion.textContent = segundaPosicion[i];

        const celdaTerceraPosicion = filas[i + 2].insertCell(4);
        celdaTerceraPosicion.textContent = terceraPosicion[i];

        const celdaPelotasGanadas = filas[i + 2].insertCell(5);
        celdaPelotasGanadas.textContent = pelotasGanadas[i];

        const celdaCtdd = filas[i + 2].insertCell(6);
        celdaCtdd.textContent = cantidadTarjetas[i];

        const celdaSuma = filas[i + 2].insertCell(7);
        celdaSuma.textContent = sumaGolpes[i];

        const promedio = filas[i + 2].insertCell(8);
        let resultado = sumaGolpes[i] / cantidadTarjetas[i];
        resultado += (totalNPT[i] * 2); 

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

    console.log("Matriz antes de ordenar:", JSON.stringify(matriz));
    matriz.sort(compararPorColumna9);

    console.log("Matriz después de ordenar:", JSON.stringify(matriz));
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

    // Ahora matrizOriginal contiene las filas ordenadas
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

// :::::::::::::::::::::::::::::::::::::::::::::::    
// :::::::::::::::::: pone total de jugadores
// :::::::::::::::::::::::::::::::::::::::::::::::
    let filaTotalJugadores = document.getElementById("totalJug");

    fechas.forEach ( fecha => {
        const totalDia = filaTotalJugadores.insertCell(-1);
        totalDia.textContent = fecha.jugadores;
    })

}); //  aca termina la funcion principal


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
// :::::::::::::::::: leer Datos Fechas
// :::::::::::::::::::::::::::::::::::::::::::::::

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
