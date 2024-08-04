// Planilla de resultados generales de los sábados

// Obtén la referencia a la tabla en tu HTML
let tabla = document.getElementById("miTabla");

const sumaGolpes = [];
const cantidadTarjetas = [];
const primeraPosicion = [];
const segundaPosicion = [];
const terceraPosicion = [];
const pelotasGanadas = [];
const totalPremios = [];
for (let i = 0; i < 12; i++) {
  sumaGolpes.push(0);
  cantidadTarjetas.push(0);
  pelotasGanadas.push(0);
  primeraPosicion.push(0);
  segundaPosicion.push(0);
  terceraPosicion.push(0);
  totalPremios.push(0);
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
          case 1:
            nuevaCelda.textContent = (player.neto+900)
            break;
          case 2:
            nuevaCelda.textContent = (player.neto+800)
            break;
          case 3:
            nuevaCelda.textContent = (player.neto+700)
            break;
          default:
            nuevaCelda.textContent = player.neto;
            break;}

        sumaGolpes[i - 2] = (sumaGolpes[i - 2] || 0) + player.neto;

        pelotasGanadas[i - 2] += player.pg;

        if (player.neto != 0) {
          cantidadTarjetas[i - 2]++;
        }

        switch (player.pos) {
          case 1:
            primeraPosicion[i - 2]++;
            totalPremios[i - 2]++;
            break;
          case 2:
            segundaPosicion[i - 2]++;
            totalPremios[i - 2]++;
            break;
          case 3:
            terceraPosicion[i - 2]++;
            totalPremios[i - 2]++;
            break;
          // Agrega más casos si es necesario
          default:
            // Acciones por defecto si player.pos no coincide con ninguno de los casos anteriores
            break;
        }
      }
    }
  }
}

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
  let resultadoFormateado = resultado.toFixed(1);
  promedio.textContent = resultadoFormateado;
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

// Llamada al método sort() con la función de comparación
matriz.sort(compararPorColumna9);

// Función de comparación para ordenar por la columna 9 (índice 8)
function compararPorColumna9(filaA, filaB) {
  const valorA = parseFloat(filaA[8]);
  const valorB = parseFloat(filaB[8]);
  return valorA - valorB;
}

// Crear una copia de la matriz original
const matrizCopia = matriz.map((fila) => [...fila]);

for (let i = 0; i < matriz.length; i++) {
  // Crea una nueva fila vacía
  filas[i] = [];

  filas[i] = matriz[i];
  /* console.log("matriz i: " + matriz[i]);
  console.log("filas i: " + filas[i]); */

  // Reemplazar las filas desordenadas en la matriz original
  for (let i = 0; i < matriz.length; i++) {
    // Crea una nueva fila vacía
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

for (let i = 0; i < matriz.length-2; i++) {
  // Crea una nueva fila vacía

filasOrdenadas[i + 2] = [];
  const celdaPrimeraOrd = filasOrdenadas[i + 2].getElementsByTagName("td")[0];
  celdaPrimeraOrd.textContent = matriz[i + 2][0];


  // Copia los valores de la matriz original a la nueva fila
  for (let j = 1; j < matriz[i + 2].length; j++) {
    /*filasOrdenadas[i][j] = matriz[i][j];*/
    const cel01 = filasOrdenadas[i + 2].insertCell();

    if (j>8){
      if ((matriz[i + 2][j] > 900)){
        (matriz[i + 2][j] -=900);
        //cel01.textContent = matriz[i + 2][j];
        cel01.style.color = "rgb(255, 0, 0)";
        cel01.style.fontWeight = "bold"; 
        }
          else if ((matriz[i + 2][j] > 800)){
            (matriz[i + 2][j] -=800);
            //cel01.textContent = matriz[i + 2][j];
            cel01.style.color = "rgb(0, 0, 255)";
            cel01.style.fontWeight = "bold"; 
          }
            else if ((matriz[i + 2][j] > 700)){
              (matriz[i + 2][j] -=700);
              //cel01.textContent = matriz[i + 2][j];
              //cel01.style.color = "rgb(226, 144, 22)";
              cel01.style.color = "rgb(10, 172, 27)";
              cel01.style.fontWeight = "bold"; 
              }
      }

    cel01.textContent = matriz[i + 2][j];

    if (matriz[i + 2][j] === "0") {
      cel01.textContent = "-";
      cel01.style.backgroundColor = "rgb(253, 235, 208)";
    }

    if (j===2 && cel01.textContent !== "-"){
      cel01.style.color = "rgb(255, 0, 0)";
      cel01.style.fontWeight = "bold"; 
    }

    if (j===3 && cel01.textContent !== "-"){
      cel01.style.color = "rgb(0, 0, 255)";
      cel01.style.fontWeight = "bold"; 
    }

    if (j===4 && cel01.textContent !== "-"){
      cel01.style.color = "rgb(10, 172, 27)";
      cel01.style.fontWeight = "bold"; 
    }
  } 
}


 let totalJugadores = [];
 let filaTotalJugadores = document.getElementById("totalJug");

 // saca la cantidad de fechas del parametro de fechas (datos5.js)
 for (j=9; j<(fechas.length + 9); j++){
    totalJugadores[j] = 0; 
    for (i=2; i<14; i++){ 

      if (matriz[i][j] != '0'){
        totalJugadores[j]++;
      }
    }
    const totalDia = filaTotalJugadores.insertCell(-1)
    totalDia.textContent = totalJugadores[j]
  }

