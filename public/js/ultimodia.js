let fechas = [];
let mejoresScore = [];
let ultimaFecha = [];

async function main() {
    fechas = await leerDatosFechas();
    ultimaFecha = await buscaUltimaFecha();
    console.log(`ultima fecha : ${ultimaFecha.textoFecha}, numero ${ultimaFecha.fec}`)

    const resultados = await leerDatosNetos();
    let año = "2025";

    if (año === "2025") {
        players2 = resultados.filter((resultado) => resultado.fec > 31);
    } else {
        players2 = resultados.filter((resultado) => resultado.fec < 32);
    }
    puntosRanking = await leerPuntosRanking();

    mejoresScore = players2.filter((player => player.pos == 1))
}

main().then(() => { // Ejecuta la función principal

    const ultDia = document.getElementById("ultimaFecha");
    const ctdJug = document.getElementById("ctddJugadores");
    // const ctdPel = document.getElementById("ctddPelotas")
    const ultFecha = ultimaFecha.textoFecha;

    ultDia.textContent = ultFecha;
    ctdJug.textContent = ultimaFecha.jugadores;
    // ctdPel.textContent = ultimaFecha.pelotas;

    // obtiene los movimientos de la ultima fecha
    console.log(`ultimaFecha.fec  ${ultimaFecha.fec}`)
    const filteredPlayers = players2.filter(player => player.fec == ultimaFecha.fec);

    filteredPlayers.sort((a, b) => {
        // Ordena primero por pos de forma ascendente
        if (a.pos < b.pos) return -1;
        if (a.pos > b.pos) return 1;

        // Si los valores de pos son iguales, mantiene el orden original
        return 0;
    });

    console.log("filtered " + filteredPlayers[0].id);

    // const tabResultado = document.getElementById("resultadoFecha").getElementsByTagName("tbody")[0];
    const tabResultado = document.querySelector("#resultadoFecha tbody");

    for (let i = 1; i < 13; i++) {
        const filaResultado = tabResultado.insertRow(-1);

        const celdaIndice = filaResultado.insertCell(-1);
        celdaIndice.textContent = i;

        let nombrePlayer = filaResultado.insertCell(-1);
        nombrePlayer.textContent = filteredPlayers[i - 1].play;

        let netoPlayer = filaResultado.insertCell(-1);
        netoPlayer.textContent = filteredPlayers[i - 1].neto > 0 ? filteredPlayers[i - 1].neto : "--";;

        let pelotas = filaResultado.insertCell(-1);
        pelotas.textContent = filteredPlayers[i - 1].pg > 0 ? filteredPlayers[i - 1].pg : "--";

        let puntos = filaResultado.insertCell(-1);
        // puntos.textContent = filteredPlayers[i-1].anual;
        puntos.textContent = (filteredPlayers[i - 1].anual == 0) ? "--" : filteredPlayers[i - 1].anual;

        let npt = filaResultado.insertCell(-1);
        npt.textContent = filteredPlayers[i - 1].npt;
        npt.textContent = (filteredPlayers[i - 1].npt == 1) ? "NPT" : "--";
    }

    // :::::::::::::::::::::::::::::::::::::::::::::::::::
    //  LLENA SECCION: berdis de la fecha 
    // :::::::::::::::::::::::::::::::::::::::::::::::::::
        //  lee la tabla
        //  filtra por ultima fecha leida de netos
        //  puede que no exista 
        //  llena la tabla

    // :::::::::::::::::::::::::::::::::::::::::::::::::::
    //  LLENA SECCION:  EL HOMBRE CON  MAS PELOTAS  
    // :::::::::::::::::::::::::::::::::::::::::::::::::::
    // leer ctdd de pelotas de los sábados y agregarle ctdd de la gira (en tabla puntosranking)

    const filas = 12;
    const columnas = 2;

    // Crear la matriz de 12x2 con ceros
    let matrizPelotas = new Array(filas).fill(null).map(() => new Array(columnas).fill(0));

    for (player of players2) {
        buscaroInsertar(matrizPelotas, player.play, player.pg);
    }

    // agregar en la matriz las pelotas de la gira y de la Fedex
    // for (player of puntosRanking)
    //   buscaroInsertar(matrizPelotas, player.playRkg, player.pelgan);

    let ctddPelotas = document.getElementById("pelotas");
    let nombrePelotas = document.getElementById("pelotudo");
    // let pelsabado = document.getElementById("pelotas");
    // let pelgira = document.getElementById("pelotudo");

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

    // agregar en la matriz las pelotas de la gira

    // for (player of puntosRanking)
    //   buscaroInsertar(matrizPelotas, player.playRkg, player.pelgan);

    // ordenar la matriz para sacar el mayor valor

    matrizPelotas.sort((a, b) => b[1] - a[1]);

    // Guarda la matriz para leerla en pelotas-detail.
    // Similar a localStorage, pero los datos se eliminan al cerrar la pestaña o el navegador.
    sessionStorage.setItem('miMatriz', JSON.stringify(matrizPelotas));

    ctddPelotas.textContent = matrizPelotas[0][1];
    nombrePelotas.textContent = matrizPelotas[0][0];

    let valor = matrizPelotas[0][0];
    let imgSrc;
    switch (valor) {
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
        case "Juancho":
            imgSrc = "images/profile/Juancho.png";
            break;
        case "Diegui":
            imgSrc = "images/profile/Diegui.png"
            break;
        case "Panza":
            imgSrc = "images/profile/Panza.png";
            break;
        case "Julito":
            imgSrc = "images/profile/Julito.png";
            break;
        case "Sensei":
            imgSrc = "images/profile/Sensei.png";
            break;
        // Agrega más casos según sea necesario
        default:
            imgSrc = "images/profile/marco-tiger.png";
    }

    document.getElementById('imagenDinamica').src = imgSrc;

    /* ---------- MUESTRA DETALLE PELOTAS GANADAS --------------------------------------*/
    function muestraPelotasGanadas() {
        console.log("entro en mostrar pelotas ganadas")
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
    // document.getElementById("detallePelotas")
    //     .addEventListener("click", muestraPelotasGanadas);


    /* ------   CIERRA VENTANA --------------------------------------------------------*/
    function cerrarModalPelotas() {
        var modal = document.getElementById("modalPelotasGanadas");
        modal.style.display = "none";
    }

    // Evento para el botón de cierre del modal
    document.getElementById("cerrarPelotas").addEventListener("click", cerrarModalPelotas);


    /* -----   LLENA DATOS DE PELOTAS GANADAS ------------------------------------------*/

    function llenaModalAMostrar() {
        console.log("entro en llena modal a mostrar")
        // agrega las filas
        for (i = 0; i < matrizPelotas.length; i++) {
            const lineaPelotas = tablaModalGeneralPelotas.insertRow();
            const nombreJugador = lineaPelotas.insertCell();
            nombreJugador.textContent = matrizPelotas[i][0];
            const pelotasJugador = lineaPelotas.insertCell();
            pelotasJugador.textContent = matrizPelotas[i][1];
        }
    }

    /* ::::::::::::::::::::::::::::::::::::::::::::::::::::::
    //   DETERMINA MEJOR SCORE 
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

    //  llena tabla de mejore score mensual.
    let tablaMejorScore = document.getElementById("tablaMejorScore");
    let tbodyScore = document.getElementById("tbodyScore");

    let data = [] // para poner el ganador y los puntos en localstore
    let tablaScoreMes = [];

    // Limpia cualquier fila existente en tbody
    tbodyScore.innerHTML = "";

    let sumaPuntos = 0;

    //::::::::: agrega el mes y dia que corresponde a fec.
    mejoresScore.forEach(score => {
        const fechaEncontrada = fechas.find(fecha => fecha.fec === score.fec);
        score.mesFecha = fechaEncontrada.mesFecha;
        score.diafecha = fechaEncontrada.diafecha;
        score.jugadores = fechaEncontrada.jugadores;
        // le anexo el mes de cada primera posición.
    })

    // Paso 1: Agrupar por `mesFecha` 
    const agrupadoPorMes = mejoresScore.reduce((acc, score) => {
        // Asegúrate de que acc[score.mesFecha] está inicializado
        if (!acc[score.mesFecha]) {
            acc[score.mesFecha] = [];
        }
        acc[score.mesFecha].push(score);
        return acc;
    }, {});

    // Paso 2: Filtrar para obtener el menor `neto` de cada grupo
    const mejoresPorMes = Object.keys(agrupadoPorMes).map(mes => {
        const scoresDelMes = agrupadoPorMes[mes];
        const mejorScore = scoresDelMes.reduce((mejor, actual) => {
            return (actual.neto < mejor.neto) ? actual : mejor;
        });
        return mejorScore;
    });

    console.log("tabla de mejores Por Mes")
    console.table(mejoresPorMes);

    mejoresPorMes.forEach(mes => {
        // Crea una fila en la tabla
        const filaScore = tbodyScore.insertRow();
        const celdaMes = filaScore.insertCell();

        switch (mes.mesFecha) {
            case 1: celdaMes.textContent = "Enero"; break;
            case 2: celdaMes.textContent = "Febrero"; break;
            case 3: celdaMes.textContent = "Marzo"; break;
            case 4: celdaMes.textContent = "Abril"; break;
            case 5: celdaMes.textContent = "Mayo"; break;
            case 6: celdaMes.textContent = "Junio"; break;
            case 7: celdaMes.textContent = "Julio"; break;
            case 8: celdaMes.textContent = "Agosto"; break;
            case 9: celdaMes.textContent = "Setiembre"; break;
            case 10: celdaMes.textContent = "Octubre"; break;
            case 11: celdaMes.textContent = "Noviembre"; break;
        }

        const diaScore = filaScore.insertCell();
        diaScore.textContent = mes.diafecha;

        const scoreScore = filaScore.insertCell();
        scoreScore.textContent = mes.neto;

        const playerScore = filaScore.insertCell();
        playerScore.textContent = mes.play;

        const jugadoresScore = filaScore.insertCell();
        jugadoresScore.textContent = mes.jugadores;

        const puntosScore = filaScore.insertCell();
        let totalGanado = (mes.neto < 72) ? (mes.jugadores * 0.5) + (72 - mes.neto) * 2 : (mes.jugadores * 0.5);
        puntosScore.textContent = totalGanado;

        // Agrega a la data el jugador y sus puntos
        data.push([mes.play, totalGanado]);
    });

    // Almacena `data` en localStorage
    localStorage.setItem('ganadoresScore', JSON.stringify(data));

});

async function leerDatosFechas() {
    try {
        const response = await fetch(`/leerDatosFechas`);
        if (response.ok) {
            const fechas = await response.json();
            return fechas; // Devuelve los datos obtenidos si la respuesta es exitosa
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

async function leerDatosNetos() {
    try {
        const response = await fetch(`/leerDatosNetos`);
        if (response.ok) {
            const resultados = await response.json();
            return resultados; // Devuelve datos si respuesta OK
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

async function leerPuntosRanking() {
    try {
        const response = await fetch(`/leerPuntosRanking`);
        if (response.ok) {
            const players2 = await response.json();
            return players2; // Devuelve los datos obtenidos si la respuesta es exitosa
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

async function buscaUltimaFecha() {
    try {
        const response = await fetch(`/leerUltimaFecha`);

        if (response.ok) {
            const data = await response.json();
            return data; // Devuelve los datos obtenidos si la respuesta es exitosa
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