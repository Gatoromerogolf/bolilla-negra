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
// 📢 Ruta para leer tabla FECHAS
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
// 📢 Ruta para obtener leer ultima fecha grabada (sin gira)
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
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para leer DATOS NETOS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerDatosNetos", (req, res) => {
  const query = "SELECT * FROM netos";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los DatosFecha" });
      console.log("error servidor al obtener registros datosnetos");
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
// 📢 Ruta para leer DATOS GIRAS
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerDatosGiras", (req, res) => {
  const query = "SELECT * FROM giras";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los DatosGiras" });
      console.log("error servidor al obtener registros datosgiras");
      return;
    }

    if (results.length > 0) {
      // console.log(results); // Para ver todo el array
      // console.log(results[0]); // Para ver solo la primera fila
      // console.log(Object.keys(results[0])); // Para ver las propiedades (columnas)
      res.json(results);
    } else {
      res.status(404).json({ error: "No se encontraron registros Giras" });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para leer los berdisnegros
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
// 📢 Ruta para leer los nuevoberdi
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerTablaBerdis", (req, res) => {
  const query = "SELECT * FROM nuevoberdi";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los nuevoberdi" });
      console.log("error servidor al obtener registros");
      return;
    }

    res.json(results); // siempre devuelve un array (vacío o no)
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para leer los nuevonegro
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerTablaNegros", (req, res) => {
  const query = "SELECT * FROM nuevonegro";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los nuevonegro" });
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
// 📢 Ruta para leer PUNTOS RANKING
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
// 📢 actualiza Berdi
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/actualizaBerdi", (req, res) => {
  const { hoyo, berdiFecha, berdiPlayer, berdihcp } = req.body;

  if (!hoyo || berdihcp === undefined) {
    return res
      .status(400)
      .json({ error: 'Faltan datos: "hoyo" y "berdihcp" son obligatorios' });
  }

  const selectQuery = "SELECT berdihcp FROM berdinegro WHERE hoyo = ?";
  pool.query(selectQuery, [hoyo], (err, results) => {
    if (err) {
      console.error("Error al consultar berdihcp:", err);
      return res
        .status(500)
        .json({ error: "Error al consultar el birdie existente" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró el hoyo especificado" });
    }

    const berdihcpActual = results[0].berdihcp;

    // Si no hay birdie previo, o el nuevo es de mayor handicap, se actualiza
    if (berdihcpActual === null || berdihcp > berdihcpActual) {
      const updateQuery = `
        UPDATE berdinegro
        SET berdiFecha = ?, berdiPlayer = ?, berdihcp = ?
        WHERE hoyo = ?
      `;

      pool.query(
        updateQuery,
        [berdiFecha, berdiPlayer, berdihcp, hoyo],
        (error, result) => {
          if (error) {
            console.error("Error al actualizar el birdie:", error);
            return res
              .status(500)
              .json({ error: "Error al actualizar el birdie" });
          }

          return res.status(200).json({
            success: true,
            message: "Birdie actualizado correctamente",
          });
        }
      );
    } else {
      return res.status(200).json({
        success: false,
        message: "Ya existe un birdie con mejor o igual handicap",
      });
    }
  });
});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 guardar-berdis
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/guardar-berdis", (req, res) => {
  const {
    fechakey, hoyo, par, jugador, golpes, handicap, jugadorantes, handicapantes,
  } = req.body;

  const cambioberdi =
    "INSERT INTO nuevoberdi (fechakey, hoyo, par, jugador, golpes, handicap, jugadorantes, handicapantes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const datosAPasar = [
    fechakey, hoyo, par, jugador, golpes, handicap, jugadorantes, handicapantes,
  ];

  pool.query(cambioberdi, datosAPasar, function (error, lista) {
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
// 📢 actualiza Negro
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/actualizaNegro", (req, res) => {
  const { hoyo, negroFecha, negroPlayer, negroScore, negrohcp } = req.body;

  if (!hoyo || negrohcp === undefined) {
    return res
      .status(400)
      .json({ error: 'Faltan datos: "hoyo" y "negrohcp" son obligatorios' });
  }

  const selectQuery = "SELECT negrohcp FROM berdinegro WHERE hoyo = ?";
  pool.query(selectQuery, [hoyo], (err, results) => {
    if (err) {
      console.error("Error al consultar negrohcp:", err);
      return res
        .status(500)
        .json({ error: "Error al consultar el negro existente" });
    }

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró el hoyo especificado" });
    }

    const negrohcpActual = results[0].negrohcp;

    // Si no hay negro previo, o el nuevo es de menor handicap, se actualiza
    if (negrohcpActual === null || negrohcp < negrohcpActual) {
      const updateQuery = `
        UPDATE berdinegro
        SET negroFecha = ?, negroPlayer = ?, negroScore = ?, negrohcp = ?
        WHERE hoyo = ?
      `;

      pool.query(
        updateQuery,
        [negroFecha, negroPlayer, negroScore, negrohcp, hoyo],
        (error, result) => {
          if (error) {
            console.error("Error al actualizar el berdinegro:", error);
            return res
              .status(500)
              .json({ error: "Error al actualizar el berdinegro" });
          }

          return res.status(200).json({
            success: true,
            message: "Negro actualizado correctamente",
          });
        }
      );
    } else {
      return res.status(200).json({
        success: false,
        message: "Ya existe un negro con mejor o igual handicap",
      });
    }
  });
});


// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 guardar-negros
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/guardar-negros", (req, res) => {
  const {
    fechakeyNG, hoyoNG, parNG, jugadorNG, golpesNG, handicapNG, jugadorantesNG, handicapantesNG, golpesantesNG, okNG
  } = req.body;

  const metoNegro =
    "INSERT INTO nuevonegro (fechakeyNG, hoyoNG, parNG, jugadorNG, golpesNG, handicapNG, jugadorantesNG, handicapantesNG, golpesantesNG, okNG) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const datosAPasar = [
    fechakeyNG, hoyoNG, parNG, jugadorNG, golpesNG, handicapNG, jugadorantesNG, handicapantesNG, golpesantesNG, okNG
  ];

  pool.query(metoNegro, datosAPasar, function (error, lista) {
    if (error) {
        console.log("Error:", error);
        res.status(500).json({ error: error.message });
      }
    else {
      res.status(200).json({ success: true });
    }
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
  const { fecnueva, play, neto, pos, pg, orden, anual, npt, cancha } = req.body;
  const nuevoNeto =
    "INSERT INTO netos (fec, play, neto, pos, pg, orden, anual, npt, cancha) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const datosAPasar = [
    fecnueva,
    play,
    neto,
    pos,
    pg,
    orden,
    anual,
    npt,
    cancha,
  ];

  console.log(fecnueva, play, neto, pos, pg, orden, anual, npt, cancha);

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
// 📢 Grabacion de HANDICAP
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/handicaps", (req, res) => {
  // if (!req.session.user){
  //     return res.status(401).json({ error: 'No estás autenticado' });
  // }
  const {
    jugador,
    cancha,
    fecha,
    gross,
    hcpcancha,
    neto,
    hcpbolilla,
    fechaKey
  } = req.body;
  const nuevohcp =
    "INSERT INTO handicap (jugador, cancha, fecha, gross, hcpcancha, neto, hcpbolilla, fechaKey) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const datosAPasar = [
    jugador,
    cancha,
    fecha,
    gross,
    hcpcancha,
    neto,
    hcpbolilla,
    fechaKey,
  ];

  pool.query(nuevohcp, datosAPasar, function (error, lista) {
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
// 📢 Grabacion de  COLAPINTO
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/colapinto", (req, res) => {
  // if (!req.session.user){
  //     return res.status(401).json({ error: 'No estás autenticado' });
  // }

  const { fecha, fechaKey, jugador, handicap, gross } = req.body;
  const nuevocolapinto =
    "INSERT INTO colapinto (fecha, fechaKey, player, handicap, gross) VALUES (?, ?, ?, ?, ?)";
  const datosAPasar = [fecha, fechaKey, jugador, handicap, gross];

  pool.query(nuevocolapinto, datosAPasar, function (error, resultado) {
    if (error) {
      console.error("Error al insertar en colapinto:", error);
      res.status(500).json({ error: "Error al guardar el registro" });
    } else {
      res.status(200).json({ success: true });
    }
  });
});

//::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener los registros de Colapinto
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/leerColapinto", (req, res) => {
  const query = "SELECT * FROM colapinto";

  pool.query(query, (error, results, fields) => {
    if (error) {
      res.status(500).json({ error: "Error al obtener los DatosFecha" });
      console.log("error servidor al obtener registros");
      return;
    }

    if (results.length > 0) {
      res.json(results);
    } else {
      res.json([]); // si no hay registros devuelve vacío
    }
  });
});
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para agregar un comentario
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// app.post("/agregar-comentario", (req, res) => {
//   const { usuario, comentario, fecha } = req.body;

//   if (comentario.length > 500) {
//     return res.status(400).json({
//       success: false,
//       message: "El comentario no puede superar los 500 caracteres",
//     });
//   }

//   const query =
//     "INSERT INTO comentarios (usuario, fecha, comentario) VALUES (?, ?, ?)";
//   pool.query(query, [usuario, fecha, comentario], (err, result) => {
//     if (err) throw err;
//     res.json({ success: true, message: "Comentario agregado correctamente" });
//   });
// });

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Ruta para obtener comentarios
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// app.get("/comentarios", (req, res) => {
//   const limit = parseInt(req.query.limit) || 1; // Limite de comentarios a mostrar, por defecto 1
//   const offset = parseInt(req.query.offset) || 0; // Cuántos comentarios omitir, por defecto 0

//   // Consulta para obtener comentarios de los últimos 15 días, ordenados por fecha descendente
//   const query = `
//     SELECT id, usuario, comentario, fecha
//     FROM comentarios
//     WHERE fecha >= NOW() - INTERVAL 90 DAY
//     ORDER BY fecha DESC
//     LIMIT ? OFFSET ?
//   `;

//   pool.query(query, [limit, offset], (error, results) => {
//     if (error) {
//       console.error("Error en la consulta de comentarios:", error);
//       return res
//         .status(500)
//         .json({ error: "Error en la consulta de comentarios" });
//     }

//     // Verificamos si hay más comentarios para mostrar el botón "Ver todos"
//     const checkQuery = `
//       SELECT COUNT(*) as total
//       FROM comentarios
//       WHERE fecha >= NOW() - INTERVAL 15 DAY
//     `;

//     pool.query(checkQuery, (err, countResult) => {
//       if (err) {
//         console.error("Error al contar los comentarios:", err);
//         return res
//           .status(500)
//           .json({ error: "Error al contar los comentarios" });
//       }

//       const totalComments = countResult[0].total;
//       res.json({
//         comments: results,
//         hasMore: totalComments > limit + offset, // Indica si hay más comentarios para mostrar
//       });
//     });
//   });
// });

/* Aquí he agregado los parámetros limit y offset para controlar cuántos comentarios mostrar y desde qué posición comenzar.
La consulta checkQuery verifica cuántos comentarios totales hay para saber si se debe mostrar el botón "Ver todos". */

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 comentarios   delete
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// app.delete("/comentarios/:id", async (req, res) => {
//   const commentId = req.params.id;
//   const query = "DELETE FROM comentarios WHERE id = ?";

//   pool.query(query, [commentId], (err, results) => {
//     if (err) {
//       console.error("Error al eliminar el comentario:", err);
//       return res
//         .status(500)
//         .send({ message: "Error al eliminar el comentario" });
//     }

//     // Verifica si se eliminó el comentario
//     if (results.affectedRows > 0) {
//       console.log("Comentario eliminado correctamente:", results);
//       res.status(200).send({ message: "Comentario eliminado" });
//     } else {
//       res.status(404).send({ message: "Comentario no encontrado" });
//     }
//   });
// });

const router = express.Router();

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 Obtener todas las canchas
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
app.get("/api/hoyos/:idCancha", async (req, res) => {
  const idCancha = req.params.idCancha;
  const query =
    "SELECT hoyo, par, handicap FROM hoyos WHERE cancha_id = ? ORDER BY hoyo";

  pool.query(query, [idCancha], (error, results, fields) => {
    if (error) {
      console.error("Error servidor al obtener hoyos:", error);
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
// 📢 Guardar resultados de un jugador
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Guardar resultados de un jugador
app.post("/api/tarjetas", (req, res) => {

  const { jugador, fecha, cancha, handicap, hoyos } = req.body;

  if (!jugador || !fecha || !cancha || !handicap || !Array.isArray(hoyos)) {
    return res.status(400).json({ error: "Faltan datos o formato incorrecto" });
  }

  //Construye un arreglo de arreglos (values) para hacer una sola inserción masiva:
  const values = hoyos.map((h) => [
    jugador,
    fecha,
    cancha,
    handicap,
    h.hoyo,
    h.golpes,
  ]);

  //Ejecuta la consulta INSERT INTO ... VALUES ? con múltiples filas:
  const query = `
    INSERT INTO tarjetas (jugador, fecha, cancha, handicap, hoyo, golpes)
    VALUES ?
  `;
  //Esto hace que se inserten varios registros, uno por cada hoyo, todos asociados al mismo jugador y fecha.

  pool.query(query, [values], (error, results) => {
    if (error) {
      console.error("Error al grabar la tarjeta:", error);
      return res.status(500).json({ error: "Error al grabar la tarjeta" });
    }
    console.log("tarjeta grabada con éxito");
    res.json({ message: "Tarjeta guardada con éxito" });
  });

});

// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// 📢 verifica si una tarjeta fue cargada
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
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
// 📢 calculo de 6 handicap bolilla
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.get("/api/promedios", (req, res) => {
  const query = `
    SELECT jugador, hcpbolilla, hcpcancha
    FROM (
      SELECT jugador, hcpbolilla, hcpcancha,
             ROW_NUMBER() OVER (PARTITION BY jugador ORDER BY fechaKey DESC) AS rn
      FROM handicap
    ) AS sub
    WHERE rn <= 6
  `;

  pool.query(query, (error, rows) => {
    if (error) {
      console.error("Error al obtener promedios:", error);
      return res.status(500).json({ error: "Error al obtener los datos" });
    }

    // Agrupar por jugador
    const jugadores = {};
    for (const row of rows) {
      const { jugador, hcpbolilla, hcpcancha } = row;

      if (!jugadores[jugador]) {
        jugadores[jugador] = {
          bolillas: [],
          hcpcancha: null,
        };
      }

      jugadores[jugador].bolillas.push(hcpbolilla);

      // Guardar solo el primer hcpcancha (el de rn = 1)
      if (jugadores[jugador].hcpcancha === null) {
        jugadores[jugador].hcpcancha = hcpcancha;
      }
    }

    // Calcular promedio y cantidad
    const resultados = Object.entries(jugadores).map(([jugador, datos]) => {
      const suma = datos.bolillas.reduce((a, b) => a + b, 0);
      const promedio = Math.round(suma / datos.bolillas.length);

      return {
        jugador,
        handicap: datos.hcpcancha,
        promedio,
        cantidad: datos.bolillas.length,
      };
    });

    res.json(resultados); // 👈 faltaba enviar la respuesta
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
