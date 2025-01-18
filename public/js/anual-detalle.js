// Planilla de resultados generales de los sábados

let resultadosFiltrados = [];

let año = "2025" // el año que viene cambiamos

async function main() {

    // Obtén la URL actual
    const urlParams = new URLSearchParams(window.location.search);

    const playerName = urlParams.get('player');
    const profileImage = document.getElementById('fotoDetalle');
    profileImage.src = `images/profile/${playerName}.png`;

    // Opcional: Mostrar el nombre en la página
    if (playerName) {
        document.getElementById("playerName").textContent = playerName;
    }
    const resultados = await leerDatosNetos();
    if (!resultados || resultados.length === 0) {
        console.error("No se obtuvieron datos de leerDatosNetos o están vacíos.");
        return;
    }

    resultadosFiltrados = resultados.filter((resultado) => resultado.play == playerName && resultado.fec > 31 && resultado.anual > 0);
    fechas = await leerDatosFechas();
}

main().then(() => {

    console.table(resultadosFiltrados);

    let tablaAnual = document.getElementById("tablaDetalle");
    let tbody = tablaAnual.querySelector("tbody"); // Selecciona el tbody de la tabla
    
    // Limpia cualquier fila existente en tbody
    tbody.innerHTML = "";
    
    let sumaPuntos = 0;
    resultadosFiltrados.forEach(resultado => {

        // Crea una fila en la tabla
        const fila = tbody.insertRow();
        const celdaTextoFecha = fila.insertCell();
            // Encuentra el objeto en fechas que coincida con el fec de resultado
        const fechaEncontrada = fechas.find(fecha => fecha.fec === resultado.fec);

        // Asigna el contenido a la celda
        celdaTextoFecha.textContent = fechaEncontrada ? fechaEncontrada.textoFecha : 'Fecha no encontrada';

        const celdaJugadores = fila.insertCell();
        celdaJugadores.textContent = fechaEncontrada.jugadores

        const celdaPosicion = fila.insertCell();
        celdaPosicion.textContent = resultado.pos;

        const celdaPuntos = fila.insertCell();
        celdaPuntos.textContent = resultado.anual;

        sumaPuntos += resultado.anual;
        })

        document.getElementById("totalPuntos").textContent = sumaPuntos;
        
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
