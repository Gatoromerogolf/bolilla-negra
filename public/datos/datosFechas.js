
// ::::::::::::::::::::::------------------------------------------

async function leerDatosFechas() {
    try {
      const response = await fetch(`/leeDatosFechas`);
  
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
const fechas = leerDatosFechas();

console.table (fechas)
module.exports = fechas;


// const fechas = [
//     {fec:1, dia:'Sábado', diaFecha:3, mesFecha:2, textoFecha:"Sábado 3 de Febrero"},
//     {fec:2, dia:'Sábado', diaFecha:10, mesFecha:2, textoFecha:"Sábado 10 de Febrero"},
//     {fec:3, dia:'Martes', diaFecha:13, mesFecha:2, textoFecha:"Martes 13 de Febrero"},
//     {fec:4, dia:'Sábado', diaFecha:17, mesFecha:2, textoFecha:"Sábado 17 de Febrero"},
//     {fec:5, dia:'Sábado', diaFecha:24, mesFecha:2, textoFecha:"Sábado 24 de Febrero"},
//     {fec:6, dia:'Sábado', diaFecha:2, mesFecha:3, textoFecha:"Sábado 2 de Marzo"},
//     {fec:7, dia:'Sábado', diaFecha:9, mesFecha:3, textoFecha:"Sáb 09 Marzo - Cardales"},
//     {fec:8, dia:'Sábado', diaFecha:23, mesFecha:3, textoFecha:"Sábado 23 de Marzo"},
//     {fec:9, dia:'Sábado', diaFecha:30, mesFecha:3, textoFecha:"Sábado 30 de Marzo"},
//     {fec:10, dia:'Sábado', diaFecha:1, mesFecha:4, textoFecha:"Lunes 1 de Abril"},
//     {fec:11, dia:'Sábado', diaFecha:6, mesFecha:4, textoFecha:"Sábado 6 de Abril"},
//     {fec:12, dia:'Sábado', diaFecha:20, mesFecha:4, textoFecha:"Sábado 20 de Abril"},
//     {fec:13, dia:'Sábado', diaFecha:27, mesFecha:4, textoFecha:"Sábado 27 de Abril"},
//     {fec:14, dia:'Sábado', diaFecha:4, mesFecha:5, textoFecha:"Sábado 4 de mayo"},
//     {fec:15, dia:'Sábado', diaFecha:11, mesFecha:5, textoFecha:"Sábado 11 de mayo"},
//     {fec:16, dia:'Sábado', diaFecha:18, mesFecha:5, textoFecha:"Sábado 18 de mayo"},
//     {fec:17, dia:'Sábado', diaFecha:1, mesFecha:6, textoFecha:"Sábado 1 de junio"},
//     {fec:18, dia:'Sábado', diaFecha:8, mesFecha:6, textoFecha:"Sábado 8 de junio"},
//     {fec:19, dia:'Sábado', diaFecha:15, mesFecha:6, textoFecha:"Sábado 15 de junio"},
//     {fec:20, dia:'Sábado', diaFecha:22, mesFecha:6, textoFecha:"Sábado 22 de junio"},
//     {fec:21, dia:'Sábado', diaFecha:29, mesFecha:6, textoFecha:"Sábado 29 de junio"},
//     {fec:22, dia:'Sábado', diaFecha:13, mesFecha:7, textoFecha:"Sábado 13 de julio"},
//     {fec:90, dia:"Gira", diaFecha:16, mesFecha:3,
//     textoFecha:"Sierras 2024"},
//     {fec:91, dia:"Gira", diaFecha:16, mesFecha:3,
//     textoFecha:"Ryder 2024"}
// ]

// module.exports = fechas;