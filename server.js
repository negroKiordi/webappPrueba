const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Configuración de la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'c2469337',
  password: 'gi63VAgadi',
  database: 'c2469337_Prueba1'
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para agregar un nuevo registro
app.post('/add-record', (req, res) => {
  const { campo1, campo2 } = req.body;
  const query = 'INSERT INTO tu_tabla (campo1, campo2) VALUES (?, ?)';
  
  db.query(query, [campo1, campo2], (err, result) => {
    if (err) {
      console.error('Error al insertar el registro:', err);
      res.status(500).send('Error al insertar el registro');
      return;
    }
    res.send('Registro insertado correctamente');
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
