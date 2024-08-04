// hay que leer la cantidad de pelotas de los sábados
// agregarle la cantidad de la gira
// leer el campo del html y mandarle el valor.

const filas = 12;
const columnas = 2;

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
  for (indice=0; indice<12; indice++){
    if (matriz[indice][0] === valor) {
      matriz[indice][1] += sumar;
      indice = 12;}
      else{
        if (matriz[indice][0] === 0){
          matriz[indice][0] = valor;
          matriz[indice][1] = sumar;
          indice=12;}
    }
  }
}

// hay que agregar en la matriz las pelotas de la gira (datosRanking)

for (player of puntosRanking)
  buscaroInsertar(matrizPelotas, player.playRkg, player.pelgan);

// ordenar la matriz para sacar el mayor valor

matrizPelotas.sort ((a, b) => b[1] - a[1]);

ctddPelotas.textContent = matrizPelotas[0][1];
nombrePelotas.textContent = matrizPelotas[0][0];

console.log (matrizPelotas)

let valor = matrizPelotas[0][0]; 

document.addEventListener('DOMContentLoaded', (event) => {
    let imgSrc;

    switch (valor) {
        case "Diegui":
          imgSrc = "assets/images/marco-diegui.png";
          break;
        case "Negro":
          imgSrc = "assets/images/marco-negro.png";
          break;
        case "Torni":
          imgSrc = "assets/images/marco-torni.png";
          break;
        case "Gaby":
          imgSrc = "assets/images/marco-gaby.jpg";
          break;
        case "Joaco":
          imgSrc = "assets/images/marco-joaco.jpg";
          break;
        // Agrega más casos según sea necesario
        default:
            imgSrc = "assets/images/marco-tiger.png";
    }

    document.getElementById('imagenDinamica').src = imgSrc;
});

// boton.addEventListener("click", (event) => {
//   const info = event.target.getAttribute("data-info");
//   armarDetalleGeneral(info);
//   const modal = document.getElementById("modalGeneral");
//   if (modal) {
//     modal.style.display = "block";
//   }
// });



/* ---------- MUESTRA DETALLE PELOTAS GANADAS ------*/


function muestraPelotasGanadas(){
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

document.getElementById("detallePelotas").addEventListener("click", muestraPelotasGanadas);



/* ------   CIERRA VENTANA ----*/
function cerrarModalPelotas(){
  var modal = document.getElementById("modalPelotasGanadas");
  modal.style.display = "none";
}

// Evento para el botón de cierre del modal
document.getElementById("cerrarPelotas").addEventListener("click", cerrarModalPelotas);


/* -----   LLENA DATOS DE PELOTAS GANADAS -----*/

function llenaModalAMostrar(){
  // agrega las filas
  for (i=0; i<matrizPelotas.length; i++){
    const lineaPelotas = tablaModalGeneralPelotas.insertRow();
    const nombreJugador = lineaPelotas.insertCell();
    nombreJugador.textContent = matrizPelotas[i][0];
    const pelotasJugador = lineaPelotas.insertCell();
    pelotasJugador.textContent = matrizPelotas[i][1];
  }  
}

