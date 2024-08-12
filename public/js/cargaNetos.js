const players2 = require ('../datos/datosNetos')
const mysql = require('mysql2');
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Flam822',
    database: 'bolilla_negra'
  });
conexion.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');

  // Itera sobre la constante fechas y actualiza la tabla en MySQL
  players2.forEach((player) => {
    const valorOr = player.or !==undefined ? player.or : 0;
    const query = `INSERT INTO netos (fec, play, neto, pos, pg, orden) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [player.fec, player.play, player.neto, player.pos, player.pg, valorOr];
    
    conexion.query(query, values, (err, result) => {
      if (err) throw err;
      console.log(`Registro insertado: ${result.insertId}`);
    });
  })

    // Itera sobre la constante fechas y actualiza la tabla en MySQL
  players2.forEach((player) => {
    console.log('Contenido de datosNetos:', player); 

  })



}); 