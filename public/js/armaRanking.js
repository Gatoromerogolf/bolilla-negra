
async function main() {
  const { players2, clausura } = await leerDatosNetos();
  fechas = await leerDatosFechas();
  puntosRanking = await leerPuntosRanking();

// main().then (() => { // Ejecuta la función principal

  // Paso 1: Agrupar los datos por jugador, manteniendo solo pares de fec y neto
  const playersData = {};
  let matrizRanking = [];
  let indRkg = 0;

  players2.forEach(({ play, fec, neto }) => {
    if (!playersData[play]) {
      playersData[play] = []; //inicializa el arreglo para el jugador play asignándole un nuevo arreglo vacío.
    }
    playersData[play].push({ fec, neto }); // Agrega un nuevo objeto al arreglo del jugador play. El objeto tiene dos propiedades: fec y neto. 
    }
  );

  //
  for (play in playersData) {
    playersData[play].sort((a, b) => a.neto - b.neto);
    playersData[play] = playersData[play].slice(0, 4);
    playersData[play].sort((a, b) => a.fec - b.fec);
  }

   // Paso 2: Agrupar los datos por jugador del CLAUSURA, manteniendo solo pares de fec y neto 
  const playersDataClausura = {};
  //  let matrizRanking = [];
  //  let indRkg = 0;
 
  clausura.forEach(({ play, fec, neto }) => {
    if (!playersDataClausura[play]) {
      playersDataClausura[play] = []; //inicializa el arreglo para el jugador play asignándole un nuevo arreglo vacío.
    }
    playersDataClausura[play].push({ fec, neto }); // Agrega un nuevo objeto al arreglo del jugador play. El objeto tiene dos propiedades: fec y neto. 
  });
 
   //
   for (play in playersDataClausura) {
     playersDataClausura[play].sort((a, b) => a.neto - b.neto);
     playersDataClausura[play] = playersDataClausura[play].slice(0, 4);
     playersDataClausura[play].sort((a, b) => a.fec - b.fec);
   }

  // llena los valores de la gira
  for (const puntosRkg of puntosRanking) {
    if (!matrizRanking[indRkg]) {
      matrizRanking[indRkg] = [];
    }
    matrizRanking[indRkg][0] = puntosRkg.playRkg;
    matrizRanking[indRkg][2] = puntosRkg.sierra;
    matrizRanking[indRkg][3] = puntosRkg.acantilados;
    matrizRanking[indRkg][4] = puntosRkg.tulsa;
    matrizRanking[indRkg][1] =
      puntosRkg.sierra + puntosRkg.acantilados + puntosRkg.tulsa;  
    indRkg++;
  }

  // agrega a la matriz 4 valores del apertura

  for (play in playersData) {
    let filaBuscada = matrizRanking.findIndex((fila) => fila[0] === play);
    if(filaBuscada === -1){
      console.log ("valor no encontrado: " , play)
    }
      else{
      matrizRanking[filaBuscada][5] = playersData[play][0].neto;
      matrizRanking[filaBuscada][6] = playersData[play][1].neto;
      matrizRanking[filaBuscada][7] = playersData[play][2].neto;
      if (playersData[play].length > 3){
          matrizRanking[filaBuscada][8] = playersData[play][3].neto}
        else{
          matrizRanking[filaBuscada][8] = 150}  
      for (let jota=5; jota<9; jota++){
        matrizRanking[filaBuscada][1] += matrizRanking[filaBuscada][jota];
      }
    }
  }

  // agrega a la matriz 4 valores del CLAUSURA

  for (play in playersDataClausura) {
    let filaBuscada = matrizRanking.findIndex((fila) => fila[0] === play);
    if(filaBuscada === -1){
      console.log ("valor no encontrado: " , play)
    }
      else{
      matrizRanking[filaBuscada][9] = playersDataClausura[play][0].neto;
      matrizRanking[filaBuscada][10] = playersDataClausura[play][1].neto;
      matrizRanking[filaBuscada][11] = playersDataClausura[play][2].neto;
      matrizRanking[filaBuscada][12] = playersDataClausura[play][3].neto;
      for (let jota=9; jota<13; jota++){
        matrizRanking[filaBuscada][1] += matrizRanking[filaBuscada][jota];
      }
    }
  }

  // ordena la matriz por segunda columna

  matrizRanking.sort((a, b) => a[1] - b[1]);

  //  presenta resultados
  //  ubica la matriz

  let lineaRanking = document.getElementById("lineaRanking");

  // Agrega el nombre del jugador como la primera celda
  for (indRkg = 0; indRkg < 12; indRkg++) {
    lineaRanking = tablaRanking.insertRow();
    const nombreCeldaRkg = lineaRanking.insertCell();
    nombreCeldaRkg.textContent = matrizRanking[indRkg][0];

    const totPuntos = lineaRanking.insertCell();
    totPuntos.textContent = matrizRanking[indRkg][1];

    const sierra = lineaRanking.insertCell();
    sierra.textContent = matrizRanking[indRkg][2];

    const acantilados = lineaRanking.insertCell();
    acantilados.textContent = matrizRanking[indRkg][3];

    const tulsa = lineaRanking.insertCell();
    tulsa.textContent = matrizRanking[indRkg][4];

    const unoAper = lineaRanking.insertCell();
    unoAper.textContent = matrizRanking[indRkg][5];

    const dosAper = lineaRanking.insertCell();
    dosAper.textContent = matrizRanking[indRkg][6];

    const tresAper = lineaRanking.insertCell();
    tresAper.textContent = matrizRanking[indRkg][7];

    const cuatroAper = lineaRanking.insertCell();
    cuatroAper.textContent = matrizRanking[indRkg][8];

    const unoClau = lineaRanking.insertCell();
    unoClau.textContent = matrizRanking[indRkg][5];

    const dosClau = lineaRanking.insertCell();
    dosClau.textContent = matrizRanking[indRkg][6];

    const tresClau = lineaRanking.insertCell();
    tresClau.textContent = matrizRanking[indRkg][7];

    const cuatroClau = lineaRanking.insertCell();
    cuatroClau.textContent = matrizRanking[indRkg][8];

  }

  let lineaRankingVs = document.getElementById("lineaRankingVs");

  for (indice = 0; indice < 6; indice++) {
    lineaRankingVs = tablaRankingVs.insertRow();

    let nombreCeldaRkg = lineaRankingVs.insertCell();
    nombreCeldaRkg.textContent = matrizRanking[indice][0];

    nombreCeldaRkg = lineaRankingVs.insertCell();
    nombreCeldaRkg.textContent = "vs";

    nombreCeldaRkg = lineaRankingVs.insertCell();
    nombreCeldaRkg.textContent = matrizRanking[11-indice][0];
  }
}

main().then(() => {
  // Aquí sigue el resto del código que necesita que players2 haya sido definido
}).catch((error) => {
  console.error("Hubo un error en el proceso: ", error);
});

async function leerDatosNetos() {
  try {
    const response = await fetch(`/leerDatosNetos`);
    if (response.ok) {
      const resultados = await response.json();
      console.log(resultados); // Inspecciona los datos devueltos
      const players2 = resultados.filter((record) => record.fec < 17 && record.neto > 0);
      const clausura = resultados.filter(
        (record) => record.fec > 16 && record.fec < 90 && record.neto > 0
      );

      return { players2, clausura }; // Devuelve los datos obtenidos si la respuesta es exitosa

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


async function leerPuntosRanking() {
  try {
    const response = await fetch(`/leerPuntosRanking`);
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