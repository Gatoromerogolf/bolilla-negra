// hay que leer la cantidad de pelotas de los sábados
// agregarle la cantidad de la gira
// leer el campo del html y mandarle el valor.


const filas = 12;
const columnas = 2;

async function main() {
    const resultados = await leerDatosNetos();
    if (!resultados || resultados.length === 0) {
        console.error("No se obtuvieron datos de leerDatosNetos o están vacíos.");
        return;
    }

    let año = "2025"; 

    if (año === "2025") {
        players2 = resultados.filter((resultado) => resultado.fec > 31);
    } else {
        players2 = resultados.filter((resultado) => resultado.fec < 32);
    }
}

main().then(() => {
    // Crear la matriz de 12x2 con ceros
    let matrizPelotas = new Array(filas).fill(null).map(() => new Array(columnas).fill(0));

    for (player of players2) {
        buscaroInsertar(matrizPelotas, player.play, player.pg);
    }

    let ctddPelotas = document.getElementById("pelotas");
    let nombrePelotas = document.getElementById("pelotudo");
    let pelsabado = document.getElementById("pelotas");
    let pelgira = document.getElementById("pelotudo");

    function buscaroInsertar(matriz, valor, sumar) {
        for (indice = 0; indice < 12; indice++) {
            if (matriz[indice][0] === valor) {
                matriz[indice][1] += sumar;
                indice = 12;
            }
            else {
                if (matriz[indice][0] === 0) {
                    matriz[indice][0] = valor;
                    matriz[indice][1] = sumar;
                    indice = 12;
                }
            }
        }
    }

    // hay que agregar en la matriz las pelotas de la gira (datosRanking)
    //  QUEDA PARA DESPUES
    // for (player of puntosRanking)
    //     buscaroInsertar(matrizPelotas, player.playRkg, player.pelgan);

    // ordenar la matriz para sacar el mayor valor

    matrizPelotas.sort((a, b) => b[1] - a[1]);

    ctddPelotas.textContent = matrizPelotas[0][1];
    nombrePelotas.textContent = matrizPelotas[0][0];

    console.log(matrizPelotas)

    let valor = matrizPelotas[0][0];

    document.addEventListener('DOMContentLoaded', (event) => {
        let imgSrc;

        switch (valor) {
            case "Diegui":
                imgSrc = "images/profile/Diegui.png"
                break;
            case "Negro":
                imgSrc = "images/profile/Negro.png";
                break;
            case "Torni":
                imgSrc = "images/profile/Torni.png";
                break;
            case "Gaby":
                imgSrc = "images/profile/Gaby.png";
                break;
            case "Joaco":
                imgSrc = "images/profile/Joaco.png";
                break;
            // Agrega más casos según sea necesario
            default:
                imgSrc = "images/profile/marco-tiger.png";
        }

        document.getElementById('imagenDinamica').src = imgSrc;
    });

})


    /* ---------- MUESTRA DETALLE PELOTAS GANADAS ------*/

    function muestraPelotasGanadas() {
        var modal = document.getElementById("modalPelotasGanadas");
        var tabla = document.getElementById("tablaModalGeneralPelotas");

        // Eliminar todas las filas, excepto la cabecera
        var rowCount = tabla.rows.length;
        for (var i = rowCount - 1; i > 0; i--) {
            tabla.deleteRow(i);
        }
        llenaModalAMostrar();
        modal.style.display = "block";
    }

    // document.getElementById("detallePelotas").addEventListener("click", muestraPelotasGanadas);


    /* ------   CIERRA VENTANA ----*/
    function cerrarModalPelotas() {
        var modal = document.getElementById("modalPelotasGanadas");
        modal.style.display = "none";
    }

    // Evento para el botón de cierre del modal
    // document.getElementById("cerrarPelotas").addEventListener("click", cerrarModalPelotas);


    /* -----   LLENA DATOS DE PELOTAS GANADAS -----*/

    function llenaModalAMostrar() {
        // agrega las filas
        for (i = 0; i < matrizPelotas.length; i++) {
            const lineaPelotas = tablaModalGeneralPelotas.insertRow();
            const nombreJugador = lineaPelotas.insertCell();
            nombreJugador.textContent = matrizPelotas[i][0];
            const pelotasJugador = lineaPelotas.insertCell();
            pelotasJugador.textContent = matrizPelotas[i][1];
        }
    }

    async function leerDatosNetos() {
        try {
            const response = await fetch(`/leerDatosNetos`);
            if (response.ok) {
                // const players2 = await response.json();
                // return players2; // Devuelve los datos obtenidos si la respuesta es exitosa
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