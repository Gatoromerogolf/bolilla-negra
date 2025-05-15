// node-mysql-app/app.js

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const mysql = require('mysql2');
const { pool } = require("./db");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cron = require("node-cron");

const app = express();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Middleware para parsear el cuerpo de las solicitudes
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Middleware para servir archivos estáticos
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(express.static(path.join(__dirname, "../public")));

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Endpoint para validar credenciales
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(cookieParser()); // Configura el middleware para leer cookies

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 base de datos
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
const sessionStore = new MySQLStore({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 sesión del usuario?
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Cambia esto por un secreto más seguro en producción
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Cambia esto a true si usas HTTPS
  })
);

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para servir index.html
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/", (req, res) => {
  // res.send ('Hola mundo');
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 login
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log(`llegó con ${username} y con ${password}`);
  pool.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: "Error en la base de datos" });
      } else if (results.length > 0) {
        const user = results[0]; // Accede a la primera fila de los resultados
        req.session.user = {
          id: user.id,
          username: user.username,
        };
        res.status(200).json({
          message: "Login exitoso",
          user: {
            id: user.id,
            username: user.username,
          },
        });
      } else {
        res.status(401).send("Credenciales inválidas");
      }
    }
  );
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener los registros de la tabla FECHAS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerDatosFechas", (req, res) => {
  const query = "SELECT * FROM fechas";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los DatosFecha" });
      console.log("error servidor al obtener registros");
      return;
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No se encontraron registros" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener la ultima fecha grabada (sin gira)
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerUltimaFecha", (req, res) => {
  const query = "SELECT * FROM fechas WHERE fec < 90 ORDER BY fec DESC LIMIT 1";
  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los DatosFecha" });
      console.log("error servidor al obtener registros");
      return;
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: "No se encontraron registros" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Definir la tarea cron
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// cron.schedule('0 */4 * * *', () => { cada cuatro horas
cron.schedule("*/30 * * * *", () => {
  // cada treinta minutos

  const query = "DELETE from tablalogs ORDER BY id ASC LIMIT 1";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error al eliminar la base de logs:", err);
      return;
    }
    console.log("Registro eliminado correctamente:", results);
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener los registros de DATOS NETOS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerDatosNetos", (req, res) => {
  const query = "SELECT * FROM netos";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los DatosFecha" });
      console.log("error servidor al obtener registros");
      return;
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No se encontraron registros" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener los registros de DATOS GIRAS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerDatosGiras", (req, res) => {
  const query = "SELECT * FROM giras";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los DatosGiras" });
      console.log("error servidor al obtener registros");
      return;
    }

    if (results.length > 0) {
      console.log(results); // Para ver todo el array
      console.log(results[0]); // Para ver solo la primera fila
      console.log(Object.keys(results[0])); // Para ver las propiedades (columnas)
      res.json(results);
    } else {
      res.status(404).json({ error: "No se encontraron registros Giras" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener los berdisnegros
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerBerdiNegro", (req, res) => {
  const query = "SELECT * FROM berdinegro";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los BerdiNegro" });
      console.log("error servidor al obtener registros");
      return;
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No se encontraron registros" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 actualiza Berdi Negro
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// app.post('/actualizaBerdiNegro', (req, res) => {
//     const { hoyo, berdiFecha, berdiPlayer, negroFecha, negroPlayer, negroScore } = req.body;

//     // Validar que todos los campos existen
//     if (![hoyo, berdiFecha, berdiPlayer, negroFecha, negroPlayer, negroScore].every(Boolean)) {
//         return res.status(400).json({ error: 'Faltan campos obligatorios' });
//     }

//     // Consulta de actualización
//     const query = `
//     UPDATE berdinegro
//     SET berdiFecha = ?, berdiPlayer = ?, negroFecha = ?, negroPlayer = ?, negroScore = ?
//     WHERE hoyo = ?
//     `;

//     const valores = [berdiFecha, berdiPlayer, negroFecha, negroPlayer, negroScore, hoyo];

//     pool.query(query, valores, (error, result) => {
//         if (error) {
//             console.error('Error en la actualización:', error);
//             return res.status(500).json({ error: 'Error interno en la base de datos' });
//         }

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ error: 'No se encontró el hoyo especificado' });
//         }

//         res.status(200).json({ success: true, message: 'Datos actualizados correctamente' });
//     });
// });

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Grabacion de ultima fecha
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/grabaUltimaFecha", (req, res) => {
  // if (!req.session.user){
  //     return res.status(401).json({ error: 'No estás autenticado' });
  // }
  const {
    fecnueva,
    nombreDia,
    numeroDia,
    numeroMes,
    textoFecha,
    fechaaRegistrar,
    ctddPelotas,
    ctddJugadores,
  } = req.body;
  const nuevaFecha =
    "INSERT INTO fechas (fec, dia, diafecha, mesFecha, textoFecha, fechaFull, pelotas, jugadores) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const datosAPasar = [
    fecnueva,
    nombreDia,
    numeroDia,
    numeroMes,
    textoFecha,
    fechaaRegistrar,
    ctddPelotas,
    ctddJugadores,
  ];

  pool.query(nuevaFecha, datosAPasar, function (error, lista) {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "Ya existe una fecha igual" });
      } else {
        console.log("Error:", error);
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(200).json({ success: true });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener los registros de PUNTOS RANKING
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerPuntosRanking", (req, res) => {
  const query = "SELECT * FROM puntosranking WHERE id < 13";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los DatosFecha" });
      console.log("error servidor al obtener registros");
      return;
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No se encontraron registros" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para agregar hoyo con berdi y/o negro
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// app.post('/creaBerdiNegro', (req, res) => {

//     // if (!req.session.user){
//     //     return res.status(401).json({ error: 'No estás autenticado' });
//     // }
//     const { hoyo, berdiFecha, berdiPlayer, negroFecha, negroPlayer, negroScore, negroPar } = req.body;

//     // Validar que todos los campos existen
//     if (![hoyo, berdiFecha, berdiPlayer, negroFecha, negroPlayer, negroScore, negroPar].every(Boolean)) {
//         return res.status(400).json({ error: 'Faltan campos obligatorios' });
//     }

//     const nuevoBerdiNegro = 'INSERT INTO berdinegro (hoyo, berdiFecha, berdiPlayer, negroFecha, negroPlayer, negroScore, negroPar) VALUES (?, ?, ?, ?, ?, ?, ?)';
//     const datosAPasar = [hoyo, berdiFecha, berdiPlayer, negroFecha, negroPlayer, negroScore, negroPar];

//     pool.query(nuevoBerdiNegro, datosAPasar, function (error, lista) {
//         if (error) {
//             if (error.code === 'ER_DUP_ENTRY') {
//                 res.status(409).json({ error: 'Ya existe un hoyo igual' });
//             }
//             else {
//                 console.log('Error:', error);
//                 res.status(500).json({ error: error.message });
//             }
//         } else {
//             res.status(200).json({ success: true });
//         }
//     });
// });

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 actualiza Berdi Negro variable !!!!!!!
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/actualizaBerdiNegro", (req, res) => {
  const { hoyo, berdiFecha, berdiPlayer, negroFecha, negroPlayer, negroScore } =
    req.body;

  // Verificar que se envió un `hoyo` válido
  if (!hoyo) {
    return res.status(400).json({ error: 'El campo "hoyo" es obligatorio' });
  }

  // Construir la consulta dinámicamente
  let campos = [];
  let valores = [];

  if (berdiFecha !== undefined) {
    campos.push("berdiFecha = ?");
    valores.push(berdiFecha);
  }
  if (berdiPlayer !== undefined) {
    campos.push("berdiPlayer = ?");
    valores.push(berdiPlayer);
  }
  if (negroFecha !== undefined) {
    campos.push("negroFecha = ?");
    valores.push(negroFecha);
  }
  if (negroPlayer !== undefined) {
    campos.push("negroPlayer = ?");
    valores.push(negroPlayer);
  }
  if (negroScore !== undefined) {
    campos.push("negroScore = ?");
    valores.push(negroScore);
  }

  // Si no hay campos para actualizar, devolver error
  if (campos.length === 0) {
    return res
      .status(400)
      .json({ error: "No se enviaron datos para actualizar" });
  }

  // Agregar `hoyo` al final para el `WHERE`
  valores.push(hoyo);

  const query = `UPDATE berdinegro SET ${campos.join(", ")} WHERE hoyo = ?`;

  pool.query(query, valores, (error, result) => {
    if (error) {
      console.error("Error en la actualización:", error);
      return res
        .status(500)
        .json({ error: "Error interno en la base de datos" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró el hoyo especificado" });
    }

    res
      .status(200)
      .json({ success: true, message: "Datos actualizados correctamente" });
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 elimina fecha
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.delete("/eliminaFecha", (req, res) => {
  const { fec } = req.body; // Recibe la fecha que deseas eliminar
  const eliminaFechaQuery = "DELETE FROM fechas WHERE fec = ?";
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Grabacion de NETOS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/grabaNetos", (req, res) => {
  // if (!req.session.user){
  //     return res.status(401).json({ error: 'No estás autenticado' });
  // }
  const { fecnueva, play, neto, pos, pg, orden, anual, npt } = req.body;
  const nuevoNeto =
    "INSERT INTO netos (fec, play, neto, pos, pg, orden, anual, npt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const datosAPasar = [fecnueva, play, neto, pos, pg, orden, anual, npt];

  console.log(fecnueva, play, neto, pos, pg, orden, anual, npt);

  pool.query(nuevoNeto, datosAPasar, function (error, lista) {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "Ya existe un registro igual" });
      } else {
        console.log("Error:", error);
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(200).json({ success: true });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para agregar un comentario
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/agregar-comentario", (req, res) => {
  const { usuario, comentario, fecha } = req.body;

  if (comentario.length > 500) {
    return res.status(400).json({
      success: false,
      message: "El comentario no puede superar los 500 caracteres",
    });
  }

  const query =
    "INSERT INTO comentarios (usuario, fecha, comentario) VALUES (?, ?, ?)";
  pool.query(query, [usuario, fecha, comentario], (err, result) => {
    if (err) throw err;
    res.json({ success: true, message: "Comentario agregado correctamente" });
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener comentarios
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/comentarios", (req, res) => {
  const limit = parseInt(req.query.limit) || 1; // Limite de comentarios a mostrar, por defecto 1
  const offset = parseInt(req.query.offset) || 0; // Cuántos comentarios omitir, por defecto 0

  // Consulta para obtener comentarios de los últimos 15 días, ordenados por fecha descendente
  const query = `
    SELECT id, usuario, comentario, fecha
    FROM comentarios
    WHERE fecha >= NOW() - INTERVAL 90 DAY
    ORDER BY fecha DESC
    LIMIT ? OFFSET ?
  `;

  pool.query(query, [limit, offset], (error, results) => {
    if (error) {
      console.error("Error en la consulta de comentarios:", error);
      return res
        .status(500)
        .json({ error: "Error en la consulta de comentarios" });
    }

    // Verificamos si hay más comentarios para mostrar el botón "Ver todos"
    const checkQuery = `
      SELECT COUNT(*) as total
      FROM comentarios
      WHERE fecha >= NOW() - INTERVAL 15 DAY
    `;

    pool.query(checkQuery, (err, countResult) => {
      if (err) {
        console.error("Error al contar los comentarios:", err);
        return res
          .status(500)
          .json({ error: "Error al contar los comentarios" });
      }

      const totalComments = countResult[0].total;
      res.json({
        comments: results,
        hasMore: totalComments > limit + offset, // Indica si hay más comentarios para mostrar
      });
    });
  });
});

/* Aquí he agregado los parámetros limit y offset para controlar cuántos comentarios mostrar y desde qué posición comenzar.
La consulta checkQuery verifica cuántos comentarios totales hay para saber si se debe mostrar el botón "Ver todos". */

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 comentarios   delete
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.delete("/comentarios/:id", async (req, res) => {
  const commentId = req.params.id;
  const query = "DELETE FROM comentarios WHERE id = ?";

  pool.query(query, [commentId], (err, results) => {
    if (err) {
      console.error("Error al eliminar el comentario:", err);
      return res
        .status(500)
        .send({ message: "Error al eliminar el comentario" });
    }

    // Verifica si se eliminó el comentario
    if (results.affectedRows > 0) {
      console.log("Comentario eliminado correctamente:", results);
      res.status(200).send({ message: "Comentario eliminado" });
    } else {
      res.status(404).send({ message: "Comentario no encontrado" });
    }
  });
});

const router = express.Router();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Obtener todas las canchas
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// app.get('/api/canchas', async (req, res) => {
//     try {
//         const [rows] = await db.query('SELECT id, nombre FROM canchas');
//         res.json(rows);
//     } catch (err) {
//         res.status(500).json({ error: 'Error al obtener canchas' });
//     }
// });

app.get("/api/canchas", (req, res) => {
  const query = "SELECT * FROM canchas";

  pool.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error servidor al obtener canchas:", error);
      res.status(500).json({ error: "Error al obtener las canchas" });
      return;
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No se encontraron registros" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Obtener hoyos (par y handicap) para una cancha
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// app.get("/api/hoyos/:idCancha", async (req, res) => {
//   const idCancha = req.params.idCancha;
//   console.log(`cancha recibida  ${idCancha}`);
//   try {
//     const [rows] = await pool.query(
//       "SELECT numero_hoyo, par, handicap FROM hoyos WHERE cancha_id = ? ORDER BY numero_hoyo",
//       [idCancha]
//     );
//     res.json(rows);
//   } catch (err) {
//     console.error("Error al obtener hoyos:", err); // ← Agrega este log
//     res.status(500).json({ error: "Error al obtener hoyos" });
//   }
// });

app.get("/api/hoyos/:idCancha", async (req, res) => {
  const idCancha = req.params.idCancha;
  // console.log(`cancha recibida  ${idCancha}`);
  const query =
    "SELECT hoyo, par, handicap FROM hoyos WHERE cancha_id = ? ORDER BY hoyo";

  pool.query(query, [idCancha], (error, results, fields) => {
    if (error) {
      console.error("Error servidor al obtener hoyos:", error);
      res.status(500).json({ error: "Error al obtener las canchas" });
      return;
    }
    app.get("/api/tarjetas/jugadores-cargados", async (req, res) => {
      const { fecha, cancha } = req.query;
      const [rows] = await db.query(
        "SELECT jugador FROM tarjetas WHERE fecha = ? AND cancha = ?",
        [fecha, cancha]
      );
      const jugadores = rows.map((r) => r.jugador);
      res.json(jugadores);
    });

    if (results.length > 0) {
      res.json(results);
    } else {
      res.status(404).json({ error: "No se encontraron registros" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Guardar resultados de un jugador
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Guardar resultados de un jugador
app.post("/api/tarjetas", (req, res) => {

  console.log ('entro a grabar tarjeta')
  const { jugador, fecha, cancha, handicap, hoyos } = req.body;

  if (!jugador || !fecha || !cancha || !handicap || !Array.isArray(hoyos)) {
    return res.status(400).json({ error: "Faltan datos o formato incorrecto" });
  }

  const values = hoyos.map((h) => [
    jugador,
    fecha,
    cancha,
    handicap,
    h.hoyo,
    h.golpes,
  ]);

  const query = `
    INSERT INTO tarjetas (jugador, fecha, cancha, handicap, hoyo, golpes)
    VALUES ?
  `;

  pool.query(query, [values], (error, results) => {
    if (error) {
      console.error("Error al grabar la tarjeta:", error);
      return res.status(500).json({ error: "Error al grabar la tarjeta" });
    }
    res.json({ message: "Tarjeta guardada con éxito" });
  });

  console.log ('termino de grabar la tarjeta')
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 verifica si una tarjeta fue cargada
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Guardar resultados de un jugador

app.get("/api/tarjetas/verificar", (req, res) => {
  const { jugador, fecha, cancha } = req.query;

  const query = `
    SELECT COUNT(*) AS cantidad FROM tarjetas
    WHERE jugador = ? AND fecha = ? AND cancha = ?
  `;

  pool.query(query, [jugador, fecha, cancha], (error, results) => {
    if (error) {
      console.error("Error al verificar tarjeta:", error);
      return res.status(500).json({ error: "Error al verificar tarjeta" });
    }

    const yaCargada = results[0].cantidad > 0;
    res.json({ cargada: yaCargada });
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 verifica si el jugador tiene tarjeta cargada
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// verifica si tiene tarjeta cargada
// app.get("/api/tarjetas/jugadores-cargados", async (req, res) => {
//   const { fecha, cancha } = req.query;
//   const [rows] = await db.query(
//     "SELECT jugador FROM tarjetas WHERE fecha = ? AND cancha = ?",
//     [fecha, cancha]
//   );
//   const jugadores = rows.map((r) => r.jugador);
//   res.json(jugadores);
// });

app.get("/api/tarjetas/jugadores-cargados", async (req, res) => {
  const { fecha, cancha } = req.query;
  // console.log("👉 Ruta /api/tarjetas/jugadores-cargados llamada con:", {
  //   fecha,
  //   cancha,
  // });

  const query = "SELECT jugador FROM tarjetas WHERE fecha = ? AND cancha = ?";

  pool.query(query, [fecha, cancha], (error, results) => {
    if (error) {
      console.error("❌ Error al mirar cargados:", error);
      return res.status(500).json({ error: "Error al mirar cargados" });
    }

    const jugadores = results.map((r) => r.jugador);
    res.json(jugadores);
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Captura todas las otras rutas para mostrar un 404
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
