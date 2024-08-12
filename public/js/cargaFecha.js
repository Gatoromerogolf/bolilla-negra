const fechas = require ('../datos/datosFechas')
const express = require("express");
const mysql = require('mysql2');
const app = express();

// Configuración de la conexión a MySQL
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
  fechas.forEach((fecha) => {
    const query = `INSERT INTO fechas (fec, dia, diaFecha, mesFecha, textoFecha) VALUES (?, ?, ?, ?, ?)`;
    const values = [fecha.fec, fecha.dia, fecha.diaFecha, fecha.mesFecha, fecha.textoFecha];
    
    conexion.query(query, values, (err, result) => {
      if (err) throw err;
      console.log(`Registro insertado: ${result.insertId}`);
    });
  })
}); 