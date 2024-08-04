
//  Presenta los resultados del ultimo dia jugado

const ultDia = document.getElementById("ultimaFecha");

const ultFecha = fechas[fechas.length - 3].textoFecha;

ultDia.textContent = ultFecha;

// obtiene los movimientos de la ultima fecha

const filteredPlayers = players2.filter(player => player.fec === fechas.length-2);


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

