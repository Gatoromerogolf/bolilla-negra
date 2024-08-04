// Arma ranking de Fedex

/* const filasMatFx = 12;
const columnasMatFx = 2;
const matrizFx = new Array(filasMatFx).fill(0).map(() => new Array(columnasMatFx).fill(0)); */
const matrizFx = [];

//La función **`map()`** es un **método de arreglo** que permite crear un nuevo arreglo a partir de otro, aplicando una operación o transformación a cada elemento del arreglo original.
//Aquí está el desglose:
//1. **`new Array(filasMatFx).fill(0)`**: Esto crea un nuevo arreglo con la longitud especificada por `filasMatFx` y llena cada elemento con el valor `0`. Por ejemplo, si `filasMatFx` es 3, obtendríamos `[0, 0, 0]`.
//2. **`.map(() => new Array(columnasMatFx).fill(0))`**: El método `map()` se aplica al arreglo recién creado. Para cada elemento (que en este caso son los arreglos de ceros), se ejecuta la función de devolución de llamada proporcionada. En este caso, la función de devolución de llamada crea un nuevo arreglo con la longitud especificada por `columnasMatFx` y llena cada elemento con el valor `0`. Por ejemplo, si `columnasMatFx` es 4, obtendríamos `[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]`.
//En resumen, la sentencia crea una matriz bidimensional (una matriz de arreglos) con `filasMatFx` filas y `columnasMatFx` columnas, inicializada con ceros. Es útil cuando necesitas crear una matriz con un tamaño específico y valores iniciales iguales.

//- Utilizo `findIndex` para buscar si el jugador ya existe en la matriz.
//- Si el jugador no existe, agrego un nuevo elemento al final de la matriz.
// POR ESO SE DEFINIO LA MATRIZ VACIA, SINO LO PONIA COMO FILA 13
//- Si existe el jugador, actualizo los puntos

for (const puntos of puntosFedex) {
  const nombreJugador = puntos.playFd;
  let i = matrizFx.findIndex(([jugador]) => jugador === nombreJugador);
  if (i === -1) {
    matrizFx.push([nombreJugador, puntos.puntosFd]);
  } else {
    matrizFx[i][1] += puntos.puntosFd;
  }
}

//  ORDENA DESCENDENTE  b - a
matrizFx.sort((a, b) => b[1] - a[1]);

/* 
  // Llamada al método sort() con la función de comparación
matrizFx.sort(compararPorColumna2);
// Función de comparación para ordenar por la columna 2 (índice 1)
// ASCENDENTE
function compararPorColumna2(filaA, filaB) {
  const valorA = parseFloat(filaA[1]);
  const valorB = parseFloat(filaB[1]);
  return valorA - valorB;
} */

let lineaDatosFd = document.getElementById("lineaScore");

for (i = 0; i < matrizFx.length; i++) {
  lineaDatosFd = rankingFedex.insertRow();
  const celdaNombre = lineaDatosFd.insertCell(-1);
  celdaNombre.textContent = matrizFx[i][0];

  const celdaNumero = lineaDatosFd.insertCell(-1);
  celdaNumero.textContent = matrizFx[i][1];

  /* Para crear un nuevo elemento `<td>` con un botón dentro, utilizar el método `document.createElement()`. Luego, establecer los atributos `class` y `data-info`. 

// Crea un nuevo elemento <td> para el botón*/
  const celdaBoton = document.createElement("td");

  // Crea un botón con la clase "pepe" y el atributo data-info
  const boton = document.createElement("button");
  boton.className = "pepe";
  let nombreBoton = matrizFx[i][0];
  boton.setAttribute("data-info", nombreBoton);
  boton.textContent = "Ver detalles";

  // Agrega el botón al elemento <td>
  celdaBoton.appendChild(boton);

  // Agrega la celda con el botón a la fila
  lineaDatosFd.appendChild(celdaBoton);
}

/* 
En este ejemplo:
- Creamos un nuevo elemento `<td>` llamado `celdaBoton`.
- Creamos un botón dentro de `celdaBoton` con la clase `"pepe"` y el atributo `data-info` establecido en `"Negro"`.
- Finalmente, agregamos `celdaBoton` a la fila (`lineaDatos`) de la tabla.
 */

// Selecciona todos los elementos con la clase 'pepe'
const botones = document.querySelectorAll(".pepe");

// Al seleccionar un botón, segun la data-info, borra las filas de una matriz anterior, arma la matriz a presentar (armar detalle general) y "muestra" la pantalla oculta
botones.forEach((boton) => {
  boton.addEventListener("click", (event) => {
    const info = event.target.getAttribute("data-info");
    armarDetalleGeneral(info);
    const modal = document.getElementById("modalGeneral");
    if (modal) {
      modal.style.display = "block";
    }
  });
});

function armarDetalleGeneral(info) {
  let lineaModalGeneral = document.getElementById("lineaModalGeneral");
  eliminarFilas();
  for (const jugador of puntosFedex) {
    lineaModalGeneral = tablaModalGeneral.insertRow();
    const nombreJugador = jugador.playFd;
    if (nombreJugador === info) {
      const titModGral = document.getElementById("tituloModalGeneral");
      const titPtosGral = document.getElementById("tituloPuntosGeneral");
      titModGral.textContent = nombreJugador;
      const celdaPuntos = lineaModalGeneral.insertCell(-1);
      celdaPuntos.textContent = jugador.puntosFd;
      const celdaPosicion = lineaModalGeneral.insertCell(-1);
      celdaPosicion.textContent = jugador.posFd;
      const celdaFecha = lineaModalGeneral.insertCell(-1);
      celdaFecha.textContent = jugador.fechaFd;
      for (const fechaFx of fechas) {
        if (jugador.fechaFd === fechaFx.fec) {
          celdaFecha.textContent = fechaFx.textoFecha;
        }
      }
    }
  }
}

function eliminarFilas() {
  const filasEliminar = tablaModalGeneral.getElementsByTagName("tr");
  for (let i = filasEliminar.length - 1; i > 0; i--) {
    tablaModalGeneral.deleteRow(i);
  }
}

/* 
function mostrarModal(info) {
const idModal = `modal${info}`; // Construye el ID basado en la info
const modal = document.getElementById(idModal);
if (modal) {
    modal.style.display = "block";
}
} */

function cerrarModal(idModal) {
  const modal = document.getElementById(idModal);
  if (modal) {
    modal.style.display = "none";
  }
}
