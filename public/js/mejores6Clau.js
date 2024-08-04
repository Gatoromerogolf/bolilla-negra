
// Crear una matriz de 12 filas por 22 columnas inicializada en cero
const filasMat = 12;
const columnas = 25;
const matriz2 = new Array(filasMat)
  .fill(0)
  .map(() => new Array(columnas).fill(0));

// Paso 1: Agrupar los datos por jugador, manteniendo solo pares de fec y neto
const playersData = {};

//if (!playersData[play]): verifica si no existe ningún dato para el jugador con índice play en el arreglo playersData. El ! antes de playersData[play] verifica si es falso, es decir, si es nulo, undefined, 0, false o una cadena vacía.
//Si la condición del if se cumple (es decir, no hay datos para el jugador), se ejecuta el bloque de código dentro del if.
players2.forEach(({ play, fec, neto }) => {
    if (fec > 16) {
        fec -=16;
        // Filtra los pares donde neto es mayor a 0
        if (!playersData[play]) {
          playersData[play] = []; //Aquí, se está inicializando el arreglo para el jugador play asignándole un nuevo arreglo vacío.
        }
        if (neto > 0){
        playersData[play].push({ fec, neto });
        }
         // Esto agrega un nuevo objeto al arreglo del jugador play. El objeto tiene dos propiedades: fec y neto. 
    }
});
// ordena por score neto de menor a mayor
//El método slice devuelve una copia de una porción del arreglo.  Toma los seis primeros
//ordena por fec para presentarlo por fecha
for (const play in playersData) {
  playersData[play].sort((a, b) => a.neto - b.neto);
  playersData[play] = playersData[play].slice(0, 6);
  playersData[play].sort((a, b) => a.fec - b.fec);
}

for (play in playersData) {
  let sumaNetos = 0;
  let promedios = 0;
  for (let i = 0; i < playersData[play].length; i++) {
    sumaNetos += playersData[play][i].neto;
  }
  playersData[play].sumaNetos = sumaNetos;
  promedios = sumaNetos / playersData[play].length;
  const promedioDec = promedios.toFixed(1);
  playersData[play].promedios = promedioDec;
}

for (const key in playersData) {
  if (Array.isArray(playersData[key])) {
    playersData[key].sort((a, b) => a.promedios - b.promedios);
  }
}

let lineaDatos = document.getElementById("lineaScore");

for (const nombreGrupo in playersData) {
  if (playersData.hasOwnProperty(nombreGrupo)) {
    const longitudGrupo = playersData[nombreGrupo].length;
    // Crea una nueva fila (línea de datos) en la tabla
    const lineaDatos = tablaSeis.insertRow();

    // Agrega el nombre del grupo como la primera celda
    const nombreCelda = lineaDatos.insertCell(0);
    nombreCelda.textContent = nombreGrupo;

    let sumaPuntos = lineaDatos.insertCell(1);
    sumaPuntos.textContent = playersData[nombreGrupo].sumaNetos;

    let promedios = lineaDatos.insertCell(2);
    promedios.textContent = playersData[nombreGrupo].promedios;

    function tieneValor(objetos, valorBuscado) {
      return objetos.some((objeto) => objeto.fec === valorBuscado);
    }

    for (j = 1; j < 18; j++) {
      let casillero = j + 2;
      indice = posicionValor(playersData[nombreGrupo], j);
      if (indice === -1) {
        let vacio = lineaDatos.insertCell(casillero);
        vacio.textContent = "--";
      } else {
        neto = lineaDatos.insertCell(casillero);
        neto.textContent = playersData[nombreGrupo][indice].neto;
      }
    }
    // hay que buscar en que fechas tiene netos... 1, 2, 3 etc.
    // se asocia que 1 es la primera fecha (3 febrero, 2 10 febrero etc.)
    // Como se quiere llenar toda la matriz, el valor buscado es j que indicaria primera, segunda, tercera etc. fecha.... Se busca entonces si player tiene score en la fecha j
    // ubica la posición en que se encuentra el valor buscado
    function posicionValor(objetos, valorBuscado) {
      return objetos.findIndex((objeto) => objeto.fec === valorBuscado);
    }

    // esta funcion pregunta si existe el valor buscado ( no la usamos )
    function tieneValor(objetos, valorBuscado) {
      return objetos.some((objeto) => objeto.fec === valorBuscado);
    }
  }
}

i = 0;
j = 0;

for (const play in playersData) {
  matriz2[i][0] = play;
  matriz2[i][1] = playersData[play].sumaNetos;
  matriz2[i][2] = playersData[play].promedios;
  i++;
}

i = 0;
let col = 0;
for (const elemento in playersData) {
  for (j = 0; j < playersData[elemento].length; j++) {
    col = playersData[elemento][j].fec + 2;
    matriz2[i][col] = playersData[elemento][j].neto;
  }
  i++;
}

matriz2.sort((filaA, filaB) => filaA[2] - filaB[2]);

let lineaDatos2 = document.getElementById("lineaScore2");

// Agrega el nombre del grupo como la primera celda
for (i = 0; i < 12; i++) {
  const lineaDatos2 = tablaSeis2.insertRow();
  for (j = 0; j < 21; j++) {
    if (matriz2[i][j] === 0) {
      matriz2[i][j] = "--";
    }
    const celdagral = lineaDatos2.insertCell(-1);
    celdagral.textContent = matriz2[i][j];
    if (matriz2[i][j] === "--") {
      celdagral.style.backgroundColor = "white";
    }
  }
}
