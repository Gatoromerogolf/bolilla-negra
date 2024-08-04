// lee datosNetos y arma una matriz con el mismo formato que datosFedex
// le agrega al final los datos de las giras y  la ryder
// cambia la lectura de datosFedex por la matriz

const matrizFedex = [];
let j = 0;

for (const player of players2) {
  if (player.pos !== 0) {

    if (!matrizFedex[j]) { // Asegurarse de que matrizFedex[j] está inicializado como un arreglo
      matrizFedex[j] = []; // Inicializar matrizFedex[j] como un arreglo vacío
    }
    matrizFedex[j][0] = player.play;
    matrizFedex[j][3] = player.fec;

    switch (player.pos) {
      case 1:
        matrizFedex[j][1] = 6;
        matrizFedex[j][2] = 1;
        break;
      case 2:
        matrizFedex[j][1] = 4;
        matrizFedex[j][2] = 2;
        break;
      case 3:
        matrizFedex[j][1] = 2;
        matrizFedex[j][2] = 3;
        break;
      default:
        break;
    }
    j++;
  }
}
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Negro';
matrizFedex[j][1] = 20;
matrizFedex[j][2] = "1°";
matrizFedex[j][3] = 90;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Edu';
matrizFedex[j][1] = 15;
matrizFedex[j][2] = "2°";
matrizFedex[j][3] = 90;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Juancho';
matrizFedex[j][1] = 10;
matrizFedex[j][2] = "3°";
matrizFedex[j][3] = 90;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Diegui';
matrizFedex[j][1] = 8;
matrizFedex[j][2] = "4°";
matrizFedex[j][3] = 90;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Torni';
matrizFedex[j][1] = 5;
matrizFedex[j][2] = "5°";
matrizFedex[j][3] = 90;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Fer';
matrizFedex[j][1] = 2;
matrizFedex[j][2] = "6°";
matrizFedex[j][3] = 90;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Sensei';
matrizFedex[j][1] = 10;
matrizFedex[j][2] = "1°";
matrizFedex[j][3] = 91;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Negro';
matrizFedex[j][1] = 10;
matrizFedex[j][2] = "1°";
matrizFedex[j][3] = 91;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Edu';
matrizFedex[j][1] = 10;
matrizFedex[j][2] = "1°";
matrizFedex[j][3] = 91;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Gaby';
matrizFedex[j][1] = 10;
matrizFedex[j][2] = "1°";
matrizFedex[j][3] = 91;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Torni';
matrizFedex[j][1] = 10;
matrizFedex[j][2] = "1°";
matrizFedex[j][3] = 91;

j++;
if (!matrizFedex[j]) {
  matrizFedex[j] = [];
}
matrizFedex[j][0] = 'Juancho';
matrizFedex[j][1] = 10;
matrizFedex[j][2] = "1°";
matrizFedex[j][3] = 91;

console.log(matrizFedex);
const matrizFx = [];

// arma la otra matriz, agrupando por jugador.

for (j = 0; j < matrizFedex.length; j++) {
  const nombreJugador = matrizFedex[j][0];
  let i = matrizFx.findIndex(([jugador]) => jugador === nombreJugador);
  if (i === -1) {
    matrizFx.push([nombreJugador, matrizFedex[j][1]]);
  } else {
    matrizFx[i][1] += matrizFedex[j][1];
  }
}

console.log(matrizFx);


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

// function armarDetalleGeneral(info) {
//   let lineaModalGeneral = document.getElementById("lineaModalGeneral");
//   eliminarFilas();
//   for (const jugador of puntosFedex) {
//     lineaModalGeneral = tablaModalGeneral.insertRow();
//     const nombreJugador = jugador.playFd;

//     if (nombreJugador === info) {
//       const titModGral = document.getElementById("tituloModalGeneral");
//       const titPtosGral = document.getElementById("tituloPuntosGeneral");
//       titModGral.textContent = nombreJugador;
//       const celdaPuntos = lineaModalGeneral.insertCell(-1);
//       celdaPuntos.textContent = jugador.puntosFd;
//       const celdaPosicion = lineaModalGeneral.insertCell(-1);
//       celdaPosicion.textContent = jugador.posFd;
//       const celdaFecha = lineaModalGeneral.insertCell(-1);
//       celdaFecha.textContent = jugador.fechaFd;
//       for (const fechaFx of fechas) {
//         if (jugador.fechaFd === fechaFx.fec) {
//           celdaFecha.textContent = fechaFx.textoFecha;
//         }
//       }
//     }
//   }
// }



function armarDetalleGeneral(info) {
  let lineaModalGeneral = document.getElementById("lineaModalGeneral");
  eliminarFilas();
  // for (const jugador of puntosFedex) {
  for (i=0;  i < matrizFedex.length; i++) {
    lineaModalGeneral = tablaModalGeneral.insertRow();
    const nombreJugador = matrizFedex[i][0];

    console.log(nombreJugador + " " + info)

    if (nombreJugador === info) {
      const titModGral = document.getElementById("tituloModalGeneral");
      const titPtosGral = document.getElementById("tituloPuntosGeneral");
      titModGral.textContent = nombreJugador;
      const celdaPuntos = lineaModalGeneral.insertCell(-1);
      // celdaPuntos.textContent = jugador.puntosFd;
      celdaPuntos.textContent = matrizFedex[i][1];

      const celdaPosicion = lineaModalGeneral.insertCell(-1);
      // celdaPosicion.textContent = jugador.posFd;
      celdaPosicion.textContent =  matrizFedex[i][2];

      const celdaFecha = lineaModalGeneral.insertCell(-1);
      // celdaFecha.textContent = jugador.fechaFd;
      celdaFecha.textContent = matrizFedex[i][3];

      for (const fechaFx of fechas) {
        // if (jugador.fechaFd === fechaFx.fec) {
          if (matrizFedex[i][3] === fechaFx.fec) {
          celdaFecha.textContent = fechaFx.textoFecha;
        }
      }
    }
  }
}
// }


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
