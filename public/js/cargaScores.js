
// Nombres de los jugadores
const nombresJugadores = [
    "Diegui", "Edu", "Fer", "Gaby", "Joaco",
    "Juancho", "Julito", "Negro", "Panza", "Presi", 
    "Sensei", "Torni"
];

let dateInput = 0;
let dateTabla = 0;
let fechaSeleccionada = 0;
let fechaaRegistrar = 0;
let fecFullTabla = 0;

let fec = 0;

// Generar la tabla de jugadores
function generarTablaJugadores() {
    const tablaJugadores = document.getElementById("tablaJugadores").getElementsByTagName('tbody')[0];
    nombresJugadores.forEach(nombre => {
        let fila = tablaJugadores.insertRow();
        let celdaNombre = fila.insertCell(0);
        let celdaNeto = fila.insertCell(1);
        // let celdaPelotas = fila.insertCell(2);
        let celdaOrden = fila.insertCell(2);

        celdaNombre.textContent = nombre;
        celdaNeto.innerHTML = `<input type="number" name="neto" min="0" style="width: 4ch;">`;
        // celdaPelotas.innerHTML = `<input type="number" name="pelotas" min="0" style="width: 3ch;">`;
        celdaOrden.innerHTML = `<input type="number" name="orden" min="0" style="width: 2ch;">`;
    });
}

async function buscaUltimaFecha (){
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

buscaUltimaFecha().then(ultimaFecha => {
if (ultimaFecha) {
    document.getElementById('ultFecha').value = ultimaFecha.textoFecha;
    document.getElementById('ultNumero').value = ultimaFecha.fec;
    fec = ultimaFecha.fec;
    // dateTabla = new Date(ultimaFecha.fechaFull);
    fecFullTabla = ultimaFecha.fechaFull;
} else {
    alert('No se encontró ninguna fecha');
}
});


// Procesar datos ingresados y actualizar la tabla de resultados
function procesarDatos() {
    document.getElementById("primeraTabla").style.display = "none";
    document.getElementById("segundaTabla").style.display = "block";
    const tablaJugadores = document.getElementById("tablaJugadores").getElementsByTagName('tbody')[0];
    const tablaResultados = document.getElementById("tablaResultados").getElementsByTagName('tbody')[0];

    const fechaRegistrar = document.getElementById('fechaRegistrar')
    const fechaParaComparar = (fechaRegistrar.value);
    const fechaSinGuiones = fechaParaComparar.split('-').join('');

    function formatToDateString(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    dateTabla = formatToDateString(fecFullTabla);
    const dateTablaSinGuiones = dateTabla.split('-').join('');

    if (fechaParaComparar) {} else {
        alert('Falta informar la fecha del torneo.')
        document.getElementById("primeraTabla").style.display = "block";
        return};

    if (dateTablaSinGuiones >= fechaSinGuiones) {
        alert('La fecha debe ser mayor a la ultima')
        document.getElementById("primeraTabla").style.display = "block";
        return};    

    const jugadores = document.getElementById('jugadores');
    const ctddJugadores = Number(jugadores.value.trim());
    if (ctddJugadores < 1 || ctddJugadores > 12) {
        alert ('no puede haber ni menos de 6 jugadores ni mas de 12')
        document.getElementById("primeraTabla").style.display = "block";
        return;
    }

    const pelJuego = document.getElementById('pelJuego');
    let ctddPelotas = Number(pelJuego.value.trim());
    if (ctddPelotas == 0) {
        ctddPelotas = ctddJugadores
    }
    if (ctddPelotas < ctddJugadores) {
        alert ('No puede haber menos pelotas que jugadores')
        document.getElementById("primeraTabla").style.display = "block";
        return;
    }

    // Limpiar la tabla de resultados
    tablaResultados.innerHTML = "";

    // Crear un array para almacenar los datos
    let datosJugadores = [];

    // Iterar sobre cada fila en la tabla de jugadores
    for (let i = 0; i < tablaJugadores.rows.length; i++) {
        let fila = tablaJugadores.rows[i];

        let nombre = fila.cells[0].textContent;
        console.log (`valor de nombre: ${nombre}`)
        let neto = fila.cells[1].getElementsByTagName('input')[0].value;
        console.log (`valor de neto: ${neto}`)
        // let pelotas = fila.cells[2].getElementsByTagName('input')[0].value;
        // console.log (`valor de pelotas: ${pelotas}`)
        let orden = fila.cells[2].getElementsByTagName('input')[0].value;
        console.log (`valor de orden: ${orden}`)

        // Agregar los datos al array si se ha completado al menos un campo
        // if (neto || pelotas || orden) {
        if (neto || orden) {
            datosJugadores.push({
                nombre: nombre,
                neto: neto || '-',
                // pelotas: pelotas || '-',
                orden: orden || '-'
            })
        }
    }

    // Ordenar los datos por el valor de "Neto" y luego por "Orden"
    datosJugadores.sort((a, b) => {
        const netoA = a.neto === '-' ? Infinity : parseInt(a.neto);
        const netoB = b.neto === '-' ? Infinity : parseInt(b.neto);
        const ordenA = a.orden === '-' ? Infinity : parseInt(a.orden);
        const ordenB = b.orden === '-' ? Infinity : parseInt(b.orden);

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
        valor2 = 2; }
    if (ctddPelotas == 10 || ctddPelotas  == 11) {
        valor1 = ctddPelotas - 4;
        valor2 = 3; }
    if (ctddPelotas == 12) {        
        valor1 = 7
        valor2 = 4 }

    if (datosJugadores.length !== ctddJugadores) {
        alert (`No coinciden los scores: ${datosJugadores.length} con la cantidad de jugadores:${jugadores.value}`)
    } else {
        let indice = 0;    
        // Insertar las filas ordenadas en la tabla de resultados
        datosJugadores.forEach(jugador => {
            let filaResultado = tablaResultados.insertRow();
            if (indice == 0) {
                jugador.pelotas = valor1}
            if (indice == 1) {
                jugador.pelotas = valor2}
            if (indice == 2) {
                jugador.pelotas = 1}
            filaResultado.insertCell(0).textContent = jugador.nombre;
            filaResultado.insertCell(1).textContent = jugador.neto;
            filaResultado.insertCell(2).textContent = jugador.pelotas;
            filaResultado.insertCell(3).textContent = jugador.orden;
            indice ++;
        })
    };
}

function modificarResultados(){
    document.getElementById("primeraTabla").style.display = "block";
}

// Función para guardar los resultados y mostrar una ventana de confirmación
function guardarResultados() {

    // Convierte el valor a un objeto Date
    // const fecha = new Date(dateInput);
    const fecha = fechaParaComparar;

    // Array con los nombres de los días de la semana
    const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

    // Array con los nombres de los meses
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Recupera la información deseada
    const nombreDia = diasSemana[fecha.getUTCDay()];
    const numeroDia = fecha.getUTCDate();
    const numeroMes = fecha.getUTCMonth() + 1;
    const nombreMes = meses[fecha.getUTCMonth()];

    // Construye el texto descriptivo de la fecha
    const textoFecha = `${nombreDia} ${numeroDia} de ${nombreMes}`;

    alert(`dateInput antes: ${dateInput}`)

    // convierte el formato de fecha para que quede aaaa-mm-dd

    function formatToDateString(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    dateInput = formatToDateString(dateInput);
    
    alert (`dateInput despues: ${dateInput}`)

    const datos = { fec, nombreDia, numeroDia, numeroMes, textoFecha, fechaaRegistrar }
    grabarNuevaFecha(datos);

    // Función para escribir los detalles de movimientos en la tabla MySQL
    async function grabarNuevaFecha(datos) {

    // Extraer los valores del objeto datos
    const { fec, nombreDia, numeroDia, numeroMes, textoFecha, fechaaRegistrar } = datos;

    const body = {
      fecnueva: fec + 1,
      nombreDia, 
      numeroDia, 
      numeroMes, 
      textoFecha,
      fechaaRegistrar
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
      // alert("estamos en el error (ins 2): " + error.message);
      throw error; // Rechaza la promesa en caso de error
    }
  }

    // Mostrar la ventana de confirmación
    alert("Se guardó la fecha\nExcelente trabajo\n\n AGUANTE LA HCDT!!!!!!");

    // Redirigir a /index.html
    window.location.href = "/index.html";
}

// Llamar a la función para generar la tabla al cargar la página
window.onload = generarTablaJugadores;