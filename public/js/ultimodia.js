let fechas = [];

async function main() {
  fechas = await leerDatosFechas();
  ultimaFecha = await buscaUltimaFecha();
  console.log (`ultima fecha : ${ultimaFecha.textoFecha}, numero ${ultimaFecha.fec}`)
  players2 = await leerDatosNetos();
  puntosRanking = await leerPuntosRanking();
}

main().then (() => { // Ejecuta la función principal

  const ultDia = document.getElementById("ultimaFecha");
  const ultFecha = ultimaFecha.textoFecha;

  ultDia.textContent = ultFecha;

  // obtiene los movimientos de la ultima fecha

  const filteredPlayers = players2.filter(player => player.fec === fechas.length-3);

  filteredPlayers.sort((a, b) => {
      // Mueve los elementos con neto igual a 0 al final
      if (a.neto === 0) return 1;
      if (b.neto === 0) return -1;

      // Ordena primero por neto de forma ascendente
      if (a.neto < b.neto) return -1;
      if (a.neto > b.neto) return 1;

      // Si el neto es el mismo, ordena por or de forma ascendente
      if (a.or < b.or) return -1;
      if (a.or > b.or) return 1;

      // Si tanto neto como or son iguales, mantiene el orden original
      return 0;
  });

  const tabResultado = document.getElementById("resultadoFecha").getElementsByTagName("tbody")[0];

  for (let i = 1; i < 13; i++) {
    const filaResultado = tabResultado.insertRow(-1);

    const celdaIndice = filaResultado.insertCell(-1);
    celdaIndice.textContent = i; 

    let nombrePlayer = filaResultado.insertCell(-1);
    nombrePlayer.textContent = filteredPlayers[i-1].play;

    let netoPlayer = filaResultado.insertCell(-1);
    netoPlayer.textContent = filteredPlayers[i-1].neto;

    let fedex = filaResultado.insertCell(-1);
    switch (i) {
      case 1:
        fedex.textContent = 6;
        break;
      case 2:
        fedex.textContent = 4;
        break;
      case 3:
          fedex.textContent = 2;
          break;
      default:
        fedex.textContent = "--";
        break;}
    }

  //  LLENA SECCION:  EL HOMBRE CON  MAS PELOTAS  :::::::::::::::::::::::::::::::::::::::::::

  // leer ctdd de pelotas de los sábados y agregarle ctdd de la gira (en tabla puntosranking)

    const filas = 12;
    const columnas = 2;

    // Crear la matriz de 12x2 con ceros
    let matrizPelotas = new Array(filas).fill(null).map(() => new Array(columnas).fill(0));

    for (player of players2) {
      buscaroInsertar(matrizPelotas, player.play, player.pg);
    }

    // agregar en la matriz las pelotas de la gira y de la Fedex
    for (player of puntosRanking)
      buscaroInsertar(matrizPelotas, player.playRkg, player.pelgan);

    let ctddPelotas = document.getElementById("pelotas");
    let nombrePelotas = document.getElementById("pelotudo");
    // let pelsabado = document.getElementById("pelotas");
    // let pelgira = document.getElementById("pelotudo");

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

    // agregar en la matriz las pelotas de la gira

    // for (player of puntosRanking)
    //   buscaroInsertar(matrizPelotas, player.playRkg, player.pelgan);

    // ordenar la matriz para sacar el mayor valor

    matrizPelotas.sort ((a, b) => b[1] - a[1]);

    ctddPelotas.textContent = matrizPelotas[0][1];
    nombrePelotas.textContent = matrizPelotas[0][0];

    let valor = matrizPelotas[0][0]; 
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

    /* ---------- MUESTRA DETALLE PELOTAS GANADAS --------------------------------------*/
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


    /* ------   CIERRA VENTANA --------------------------------------------------------*/
    function cerrarModalPelotas(){
      var modal = document.getElementById("modalPelotasGanadas");
      modal.style.display = "none";
    }

    // Evento para el botón de cierre del modal
    document.getElementById("cerrarPelotas").addEventListener("click", cerrarModalPelotas);


    /* -----   LLENA DATOS DE PELOTAS GANADAS ------------------------------------------*/

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