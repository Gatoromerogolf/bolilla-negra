// node-mysql-app/app.js

const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const mysql = require('mysql2');
const { pool } = require("./db");
const path = require('path');
const session = require('express-session');
const MySQLStore = require ('express-mysql-session')(session);
const cron = require('node-cron');

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::
// reemplaza por ./db
// const mysql = require('mysql2');
// const conexion = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Flam822',
//   database: 'bolilla_negra'
// });
// conexion.connect((err) => {
//   if (err) throw err;
//   console.log('Conectado a la base de datos MySQL')});
//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::.

const app = express();

// Middleware para parsear el cuerpo de las solicitudes::::::::::::::::::::
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos::::::::::::::::::::::::::::::
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint para validar credenciales :::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(cookieParser()); // Configura el middleware para leer cookies

const sessionStore = new MySQLStore({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});

app.use(session({
    secret: process.env.SESSION_SECRET, // Cambia esto por un secreto más seguro en producción
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambia esto a true si usas HTTPS
}));

// Ruta para servir index.html
app.get('/', (req, res) => {
  // res.send ('Hola mundo'); 
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/api/login', (req, res) => {
const { username, password } = req.body;
console.log (`llegó con ${username} y con ${password}`)
pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
        res.status(500).json({ error: 'Error en la base de datos' });
    } else if (results.length > 0) {
        const user = results[0]; // Accede a la primera fila de los resultados
        req.session.user = {
          id: user.id,
          username: user.username};
        res.status(200).json({ 
          message: 'Login exitoso',
          user: {
            id: user.id,
            username: user.username
          }
        }); 
    } else {
        res.status(401).send('Credenciales inválidas');
    }
});
})

// Ruta para obtener los registros de la tabla FECHAS::::::::::::::::::::
app.get('/leerDatosFechas', (req, res) => {
  const query = 'SELECT * FROM fechas';

  pool.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los DatosFecha' });
        console.log("error servidor al obtener registros");
        return;
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });

// Ruta para obtener la ultima fecha grabada (sin gira) ::::::::::::::::::::
app.get('/leerUltimaFecha', (req, res) => {
  const query = 'SELECT * FROM fechas WHERE fec < 90 ORDER BY fec DESC LIMIT 1';
  pool.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los DatosFecha' });
        console.log("error servidor al obtener registros");
        return;
      }

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Definir la tarea cron
// cron.schedule('0 */4 * * *', () => { cada cuatro horas
cron.schedule('*/30 * * * *', () => { // cada treinta minutos

  const query = 'DELETE from tablalogs ORDER BY id ASC LIMIT 1';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error al eliminar la base de logs:', err);
      return;
    }
    console.log('Registro eliminado correctamente:', results);
  });
});


  // Ruta para obtener los registros de DATOS NETOS ::::::::::::::::::::
app.get('/leerDatosNetos', (req, res) => {
  const query = 'SELECT * FROM netos';

  pool.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los DatosFecha' });
        console.log("error servidor al obtener registros");
        return;
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });

  
  // Ruta para obtener los registros de PUNTOS RANKING ::::::::::::::::::::
app.get('/leerPuntosRanking', (req, res) => {
  const query = 'SELECT * FROM puntosranking';

  pool.query(query, (error, results, fields) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los DatosFecha' });
        console.log("error servidor al obtener registros");
        return;
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No se encontraron registros' });
      }
    });
  });


// Grabacion de ultima fecha ::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/grabaUltimaFecha', (req, res) => {
  // if (!req.session.user){
  //     return res.status(401).json({ error: 'No estás autenticado' });
  // }
  const { fecnueva, nombreDia, numeroDia, numeroMes, textoFecha, fechaaRegistrar }  = req.body;
  const nuevaFecha = 'INSERT INTO fechas (fec, dia, diafecha, mesFecha, textoFecha, fechaFull) VALUES (?, ?, ?, ?, ?, ?)';
  const datosAPasar = [fecnueva, nombreDia, numeroDia, numeroMes, textoFecha, fechaaRegistrar];

  pool.query(nuevaFecha, datosAPasar, function (error, lista) {
      if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
              res.status(409).json({ error: 'Ya existe una fecha igual' });
          } else {
          console.log('Error:', error);
          res.status(500).json({ error: error.message });
      }
      } else {
          res.status(200).json({ success: true });
      }
  });
});


// Grabacion de NETOS ::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/grabaNetos', (req, res) => {
  // if (!req.session.user){
  //     return res.status(401).json({ error: 'No estás autenticado' });
  // }
  const { fecnueva, play, neto, pos, pg, orden }  = req.body;
  const nuevoNeto = 'INSERT INTO netos (fec, play, neto, pos, pg, orden) VALUES (?, ?, ?, ?, ?, ?)';
  const datosAPasar = [fecnueva, play, neto, pos, pg, orden];

  console.log (fecnueva, play, neto, pos, pg, orden)


  pool.query(nuevoNeto, datosAPasar, function (error, lista) {
      if (error) {
          if (error.code === 'ER_DUP_ENTRY') {
              res.status(409).json({ error: 'Ya existe un registro igual' });
          } else {
          console.log('Error:', error);
          res.status(500).json({ error: error.message });
      }
      } else {
          res.status(200).json({ success: true });
      }
  });
});

// Ruta para agregar un comentario
app.post('/agregar-comentario', (req, res) => {
  const { usuario, comentario, fecha } = req.body;

  if (comentario.length > 500) {
      return res.status(400).json({ success: false, message: 'El comentario no puede superar los 500 caracteres' });
  }

  const query = 'INSERT INTO comentarios (usuario, fecha, comentario) VALUES (?, ?, ?)';
  pool.query(query, [usuario, fecha, comentario], (err, result) => {
      if (err) throw err;
      res.json({ success: true, message: 'Comentario agregado correctamente' });
  });
});

// // Ruta para obtener los comentarios
// app.get('/obtener-comentarios', (req, res) => {
//   const query = `
//       SELECT * FROM comentarios
//       WHERE (fecha >= CURDATE() - INTERVAL 15 DAY) 
//       OR fecha = (SELECT MAX(fecha) FROM comentarios)
//       ORDER BY fecha DESC
//   `;
  
//   pool.query(query, (err, results) => {
//       if (err) throw err;
//       res.json(results);
//   });
// });


// Ruta para obtener comentarios
app.get('/comentarios', (req, res) => {
  const limit = parseInt(req.query.limit) || 1; // Limite de comentarios a mostrar, por defecto 1
  const offset = parseInt(req.query.offset) || 0; // Cuántos comentarios omitir, por defecto 0

  // Consulta para obtener comentarios de los últimos 15 días, ordenados por fecha descendente
  const query = `
    SELECT id, usuario, comentario, fecha
    FROM comentarios
    WHERE fecha >= NOW() - INTERVAL 15 DAY
    ORDER BY fecha DESC
    LIMIT ? OFFSET ?
  `;

  pool.query(query, [limit, offset], (error, results) => {
    if (error) {
      console.error('Error en la consulta de comentarios:', error);
      return res.status(500).json({ error: 'Error en la consulta de comentarios' });
    }
    
    // Verificamos si hay más comentarios para mostrar el botón "Ver todos"
    const checkQuery = `
      SELECT COUNT(*) as total
      FROM comentarios
      WHERE fecha >= NOW() - INTERVAL 15 DAY
    `;
    
    pool.query(checkQuery, (err, countResult) => {
      if (err) {
        console.error('Error al contar los comentarios:', err);
        return res.status(500).json({ error: 'Error al contar los comentarios' });
      }

      const totalComments = countResult[0].total;
      res.json({
        comments: results,
        hasMore: totalComments > limit + offset // Indica si hay más comentarios para mostrar
      });
    });
  });
});


/* Aquí he agregado los parámetros limit y offset para controlar cuántos comentarios mostrar y desde qué posición comenzar.
La consulta checkQuery verifica cuántos comentarios totales hay para saber si se debe mostrar el botón "Ver todos". */







// Captura todas las otras rutas para mostrar un 404 :::::::::::::::::::::::::::::::::
app.get('*', (req, res) => {
  res.status(404).send('Page Not Found');
});


// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on port ${port}`));

