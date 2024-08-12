const puntosRanking = require ('../datos/datosRanking')
console.log('Contenido de puntosRanking:', puntosRanking); 
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
 puntosRanking.forEach((player) => {
    // const valorOr = player.or !==undefined ? player.or : 0;
    const query = `INSERT INTO puntosranking (playRkg, sierra, acantilados, tulsa, pelgan) VALUES (?, ?, ?, ?, ?)`;
    const values = [player.playRkg, player.sierra, player.acantilados, player.tulsa, player.pelgan];
    
    conexion.query(query, values, (err, result) => {
      if (err) throw err;
      console.log(`Registro insertado: ${result.insertId}`);
    });
  })
}); 