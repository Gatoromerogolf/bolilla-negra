// Nombres de los jugadores
const nombresJugadores = [
    "Diegui",
    "Edu",
    "Fer",
    "Gaby",
    "Joaco",
    "Juancho",
    "Julito",
    "Negro",
    "Panza",
    "Presi",
    "Sensei",
    "Torni",
];

let errorBerdi = false;
let dateInput = 0;
let dateTabla = 0;
let fechaSeleccionada = 0;
let fechaaRegistrar = 0;
let fechaSinGuiones = 0;
let fechaParaComparar = 0;
let fecFullTabla = 0;
let sumaJugadores = 0;
let ctddPelotas = 0;
let ctddJugadores = 0;

let datosJugadores = [];

let fec = 0;

/*---------------------------------------
// 🔸 GENERAR TABLA DE JUGADORES                
-----------------------------------------*/
// Generar la tabla de jugadores
function generarTablaJugadores() {
    const tablaJugadores = document
        .getElementById("tablaJugadores")
        .getElementsByTagName("tbody")[0];
    nombresJugadores.forEach((nombre) => {
        let fila = tablaJugadores.insertRow();
        let celdaNombre = fila.insertCell(0);
        let celdaNeto = fila.insertCell(1);
        let celdaOrden = fila.insertCell(2);
        let celdaNpt = fila.insertCell(3);

        celdaNombre.textContent = nombre;
        celdaNeto.innerHTML = `<input type="number" name="neto" min="0" style="width: 4ch;">`;
        celdaOrden.innerHTML = `<input type="number" name="orden" min="0" style="width: 2ch;">`;
        celdaNpt.innerHTML = `<input type="number" name="orden" min="0" max="1" style="width: 2ch;">`;
    });

    const tablaBerdies = document
        .getElementById("tablaBerdies")
        .getElementsByTagName("tbody")[0];
    for (i = 1; i < 6; i++) {
        let fila = tablaBerdies.insertRow();
        let celdaHoyo = fila.insertCell(0);
        let celdaNombre = fila.insertCell(1);
        let celdaScore = fila.insertCell(2);
        celdaHoyo.innerHTML = `<input type="number" name="hoyo" min="0" style="width:4ch; margin=4px">`;
        celdaNombre.innerHTML = `<input type="text" name="nombre" style="width: 9ch;">`;
        celdaScore.innerHTML = `<input type="number" name="nombre" style="width: 5ch;">`;
    }
}

/*---------------------------------------
// 🔸 ASYNC BUSCA ULTIMA FECHA               
-----------------------------------------*/
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

/*---------------------------------------
// 🔸 BUSCA ULTIMA FECHA               
-----------------------------------------*/
buscaUltimaFecha().then((ultimaFecha) => {
    if (ultimaFecha) {
        document.getElementById("ultFecha").value = ultimaFecha.textoFecha;
        document.getElementById("ultNumero").value = ultimaFecha.fec;
        fec = ultimaFecha.fec;
        fecFullTabla = ultimaFecha.fechaFull;
    } else {
        alert("No se encontró ninguna fecha");
    }
});

/*---------------------------------------
// 🔸 ELIMINAR DATOS                
-----------------------------------------*/
function eliminarDatos(fec) {
    const confirmar = confirm(
        `¿Estás seguro de que deseas eliminar el registro de fecha N°: ${fec}?`
    );

    if (!confirmar) {
        // Si el usuario no confirma, salir de la función
        return;
    }

    alert(`elimina registro, ${fec}`);
    fetch("/eliminaFecha", {
        method: "DELETE", // Método HTTP
        headers: {
            "Content-Type": "application/json", // Tipo de contenido
        },
        body: JSON.stringify({ fec }), // Convertir el cuerpo a JSON
    })
        .then((response) => {
            if (!response.ok) {
                return response.json().then((err) => {
                    throw err;
                });
            }
            return response.json(); // Parsear la respuesta JSON
        })
        .then((data) => {
            console.log("Fecha eliminada correctamente:", data.message);
            alert("Fecha eliminada correctamente");
        })
        .catch((error) => {
            console.error(
                "Error al eliminar la fecha:",
                error.error || error.message
            );
            alert(`Error: ${error.error || "No se pudo eliminar la fecha"}`);
        });
}

/*---------------------------------------
// 🔸   PROCESAR DATOS               
-----------------------------------------*/
// Procesar datos ingresados y actualizar la tabla de resultados
function procesarDatos() {

    validacionBerdiNegro();
    if (errorBerdi) { return };

    document.getElementById("primeraTabla").style.display = "none";
    document.getElementById("segundaTabla").style.display = "block";
    const tablaJugadores = document
        .getElementById("tablaJugadores")
        .getElementsByTagName("tbody")[0];
    const tablaResultados = document
        .getElementById("tablaResultados")
        .getElementsByTagName("tbody")[0];

    const fechaRegistrar = document.getElementById("fechaRegistrar");
    fechaParaComparar = fechaRegistrar.value;
    fechaSinGuiones = fechaParaComparar.split("-").join("");

    function formatToDateString(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    dateTabla = formatToDateString(fecFullTabla);
    const dateTablaSinGuiones = dateTabla.split("-").join("");

    if (fechaParaComparar) {
    } else {
        alert("Falta informar la fecha del torneo.");
        document.getElementById("primeraTabla").style.display = "block";
        return;
    }

    if (dateTablaSinGuiones >= fechaSinGuiones) {
        alert("La fecha debe ser mayor a la ultima");
        document.getElementById("primeraTabla").style.display = "block";
        return;
    }

    fechaaRegistrar = fechaSinGuiones;

    const jugadores = document.getElementById("jugadores");
    ctddJugadores = Number(jugadores.value.trim());
    if (ctddJugadores < 1 || ctddJugadores > 12) {
        alert("no puede haber ni menos de 6 jugadores ni mas de 12");
        document.getElementById("primeraTabla").style.display = "block";
        return;
    }

    const ctddPelotas = ctddJugadores;
    alert(`cantidad de pelotas ${ctddPelotas}`)
    tablaResultados.innerHTML = "";
    sumaJugadores = 0;

    // Crear un array para almacenar los datos
    datosJugadores = [];

    // Iterar sobre cada fila en la tabla de jugadores
    for (let i = 0; i < tablaJugadores.rows.length; i++) {
        let fila = tablaJugadores.rows[i];

        let nombre = fila.cells[0].textContent;
        let neto = fila.cells[1].getElementsByTagName("input")[0].value;
        let orden = fila.cells[2].getElementsByTagName("input")[0].value;
        let npt = fila.cells[3].getElementsByTagName("input")[0].value;

        // Agregar los datos al array si se ha completado al menos un campo
        datosJugadores.push({
            nombre: nombre,
            neto: neto || "-",
            orden: orden || "-",
            npt: npt || "-"
        });

        if (neto || npt) {
            sumaJugadores++;
        }
    }

    // Ordenar los datos por el valor de "Neto" y luego por "Orden"
    datosJugadores.sort((a, b) => {
        const netoA = a.neto === "-" ? Infinity : parseInt(a.neto);
        const netoB = b.neto === "-" ? Infinity : parseInt(b.neto);
        const ordenA = a.orden === "-" ? Infinity : parseInt(a.orden);
        const ordenB = b.orden === "-" ? Infinity : parseInt(b.orden);

        if (netoA === netoB) {
            return ordenA - ordenB;
        }
        return netoA - netoB;
    });

    // Asigna la cantidad de pelotas a cada jugador
    let valor1 = 0;
    let valor2 = 0;

    if (ctddPelotas < 10) {
        valor1 = ctddPelotas - 3;
        valor2 = 2;
    }
    if (ctddPelotas == 10 || ctddPelotas == 11) {
        valor1 = ctddPelotas - 4;
        valor2 = 3;
    }
    if (ctddPelotas == 12) {
        valor1 = 7;
        valor2 = 4;
    }

    // if (datosJugadores.length !== ctddJugadores) {
    if (sumaJugadores !== ctddJugadores) {
        alert(
            `No coinciden los scores: ${sumaJugadores} con la cantidad de jugadores:${jugadores.value}`
        );
    } else {
        let indice = 0;
        // Insertar las filas ordenadas en la tabla de resultados
        datosJugadores.forEach((jugador) => {
            let filaResultado = tablaResultados.insertRow();
            if (indice == 0) {
                jugador.pelotas = valor1;
            }
            if (indice == 1) {
                jugador.pelotas = valor2;
            }
            if (indice == 2) {
                jugador.pelotas = 1;
            }

            if (jugador.neto > 0) {
                jugador.orden = indice + 1;
                jugador.anual = ctddJugadores - indice;
            }

            filaResultado.insertCell(0).textContent = jugador.nombre;
            filaResultado.insertCell(1).textContent = jugador.neto;
            filaResultado.insertCell(2).textContent = jugador.orden;
            filaResultado.insertCell(3).textContent = jugador.pelotas;
            filaResultado.insertCell(4).textContent = jugador.anual;
            filaResultado.insertCell(5).textContent = jugador.npt;
            indice++;
        });
    }
}

/*---------------------------------------
// 🔸 VALIDACION BERDI NEGRO              
-----------------------------------------*/
function validacionBerdiNegro() {
    // Seleccionar solo las filas dentro del <tbody> de berdies y negros
    const filas = document.querySelectorAll("#tablaBerdies tbody tr");
    // Iterar sobre cada fila 
    errorBerdi = false;

    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];

        let hoyoInput = fila.cells[0].querySelector("input");
        let nombreInput = fila.cells[1].querySelector("input");
        let scoreInput = fila.cells[2].querySelector("input");

        // Verificar si los inputs existen antes de acceder a .value
        let hoyo = hoyoInput ? hoyoInput.value : "";
        let nombre = nombreInput ? nombreInput.value : "";
        let score = scoreInput ? scoreInput.value : "";

        console.log(`valor de hoyo: ${hoyo}, nombre: ${nombre}, score: ${score}`);

        if (!score) {
            console.log(`es un birdie ${nombre}, hoyo ${hoyo}`)
        } else {
            console.log(`es un negro ${nombre}, hoyo ${hoyo}, score: ${score}`)
        }

        // se fija si ya hay datos para ese hoyo.
        let registro = berdiNegro.find(reg => reg.hoyo == hoyo);

        if (!registro) {
            alert(`hoyo ${hoyo} nuevo con novedades`)
        } else {
            if (registro[berdiFecha] !== null) {
                alert(`No papá!! Ya existe un birdie de ${registro[berdiPlayer]} en el hoyo ${hoyo}`)
                errorBerdi = true;
                return// si ya hay otro birdie, mensaje de error
            }
        }
    }
}

/*---------------------------------------
// 🔸   MODIFICAR RESULTADOS               
-----------------------------------------*/
function modificarResultados() {
    document.getElementById("primeraTabla").style.display = "block";
    document.getElementById("segundaTabla").style.display = "none";
}

/*---------------------------------------
// 🔸   GUARDAR RESULTADOS               
-----------------------------------------*/
// Función para guardar los resultados y mostrar una ventana de confirmación
function guardarResultados() {
    // Convierte el valor a un objeto Date para usar la funcion getUTC
    const fecha = new Date(fechaParaComparar);

    // Array con los nombres de los días de la semana
    const diasSemana = [
        "domingo",
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
    ];

    // Array con los nombres de los meses
    const meses = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
    ];

    // Recupera la información deseada
    const nombreDia = diasSemana[fecha.getUTCDay()];
    const numeroDia = fecha.getUTCDate();
    const numeroMes = fecha.getUTCMonth() + 1;
    const nombreMes = meses[fecha.getUTCMonth()];

    // Construye el texto descriptivo de la fecha
    const textoFecha = `${nombreDia} ${numeroDia} de ${nombreMes}`;

    const datos = {
        fec,
        nombreDia,
        numeroDia,
        numeroMes,
        textoFecha,
        fechaaRegistrar,
        ctddPelotas,
        ctddJugadores,
    };
    grabarNuevaFecha(datos);

    // Función para escribir los detalles de movimientos en la tabla MySQL
    async function grabarNuevaFecha(datos) {
        // Extraer los valores del objeto datos
        const {
            fec,
            nombreDia,
            numeroDia,
            numeroMes,
            textoFecha,
            fechaaRegistrar,
            ctddPelotas,
            ctddJugadores,
        } = datos;

        const body = {
            fecnueva: fec + 1,
            nombreDia,
            numeroDia,
            numeroMes,
            textoFecha,
            fechaaRegistrar,
            ctddPelotas,
            ctddJugadores,
        };

        try {
            const response = await fetch("/grabaUltimaFecha", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
                credentials: "include",
            });

            const result = await response.json();
            if (result.success) {
                console.log("no hay error");
            } else {
                throw new Error(result.error || "Error desconocido grabar parciales");
            }
        } catch (error) {
            console.log("Error:", error);
            throw error; // Rechaza la promesa en caso de error
        }
    }

    //  Guarda los netos.
    indice = 0;
    let fecnueva = ++fec;

    datosJugadores.forEach((jugador) => {
        if (indice == 0) {
            jugador.pos = 1;
        }
        if (indice == 1) {
            jugador.pos = 2;
        }
        if (indice == 2) {
            jugador.pos = 3;
        }

        if (indice > 2) {
            jugador.pos = indice + 1;
            jugador.pelotas = 0;
            jugador.orden = 0;
        }
        if (jugador.neto < 50 || jugador.neto === "-") {
            jugador.neto = 0;
        }

        if (jugador.orden === "-") {
            jugador.orden = 0;
        }

        if (jugador.neto > 50) {
            jugador.anual = ctddJugadores - indice;
        } else {
            jugador.anual = 0;
        }

        //  Grabar NETOS
        let play = jugador.nombre;
        let neto = jugador.neto;
        let pos = jugador.pos;
        let pg = jugador.pelotas;
        let orden = jugador.orden;
        let anual = jugador.anual;
        let npt = jugador.npt;
        npt = (npt == 1) ? 1 : 0; // Asigna 1 si npt es = a 1, sino asigna 0.

        const datosNetos = { fecnueva, play, neto, pos, pg, orden, anual, npt };
        grabarNuevoNeto(datosNetos);

        indice++;
    });

    // 🔸 guarda berdis y negros

    const filas = document.querySelectorAll("#tablaBerdies tbody tr");

    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];

        let hoyoInput = fila.cells[0].querySelector("input");
        let nombreInput = fila.cells[1].querySelector("input");
        let scoreInput = fila.cells[2].querySelector("input");

        // Verificar si los inputs existen antes de acceder a .value
        let hoyo = hoyoInput ? hoyoInput.value : "";
        let nombre = nombreInput ? nombreInput.value : "";
        let score = scoreInput ? scoreInput.value : "";

        // se fija si ya hay datos para ese hoyo.
        let registro = berdiNegro.find(reg => reg.hoyo == hoyo);

        if (!registro) {  //como no existe el hoyo, crea el registro.
            // en la creación tiene que mandar el par del hoyo.
            let par = calculaPar(hoyo)
            if (!score) {  // crea con berdi
                crearBerdi()
            } else { // crea con negro
                crearNegro()
            }
        }
        else { // como ya existe el hoyo, actualiza los campos
            if (score) {
                actualizarNegro(hoyo, registro.negroFecha, registro.negroPlayer, registro.negroScore)
            } else {
                actualizarBerdi(hoyo, registro.berdiFecha, registro.berdiPlayer)
            }
        }
    }

//  🔸 Mostrar la ventana de confirmación
alert("Se guardó la fecha\nExcelente trabajo\n\n AGUANTE LA HCDT!!!!!!");

// // Redirigir a /index.html
window.location.href = "/index.html";
}

/*---------------------------------------
// 🔸   ACTUALIZAR BERDI               
-----------------------------------------*/
async function actualizarBerdi(hoyo, berdiFecha, berdiPlayer) {
    return await fetch('/actualizaBerdiNegro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hoyo, berdiFecha, berdiPlayer }) // Solo enviamos estos campos
    }).then(res => res.json()).then(console.log).catch(console.error);
}

/*---------------------------------------
// 🔸   ACTUALIZAR NEGRO               
-----------------------------------------*/
async function actualizarNegro(hoyo, negroFecha, negroPlayer, negroScore) {
    return await fetch('/actualizaBerdiNegro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hoyo, negroFecha, negroPlayer, negroScore }) // Solo estos campos
    }).then(res => res.json()).then(console.log).catch(console.error);
}

/*---------------------------------------
// 🔸   CALCULA PAR               
-----------------------------------------*/
function calculaPar(hoyo) {
    let par;  
    switch (hoyo) {
        case 1: case 2: case 3: case 6: case 9:
        case 10: case 11: case 12: case 15: case 18:
            par = 4;
            break;
        case 4: case 8: case 13: case 17:
            par = 3;
            break;
        case 5: case 7: case 14: case 16:
            par = 5;
            break;
        default:
            par = 99;
    }
    return par; // Aquí retornamos el valor
}

/*---------------------------------------
// 🔸 GRABAR NUEVO NETO               
-----------------------------------------*/
// Función para escribir los detalles de movimientos en la tabla MySQL
async function grabarNuevoNeto(datosNetos) {
    // Extraer los valores del objeto datos
    const { fecnueva, play, neto, pos, pg, orden, anual, npt } = datosNetos;

    const body = {
        fecnueva,
        play,
        neto,
        pos,
        pg,
        orden,
        anual,
        npt,
    };

    try {
        const response = await fetch("/grabaNetos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            credentials: "include",
        });

        const result = await response.json();
        if (result.success) {
            console.log("no hay error");
        } else {
            throw new Error(result.error || "Error desconocido grabar Netos");
        }
    } catch (error) {
        console.log("Error:", error);
        throw error; // Rechaza la promesa en caso de error
    }
}

/*---------------------------------------
// 🔸 CARGA LA PAGINA               
-----------------------------------------*/
// Llamar a la función para generar la tabla al cargar la página
window.onload = generarTablaJugadores;
