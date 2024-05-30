const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

let database = []; // Simulación de una base de datos en memoria

app.post('/save', (req, res) => {
    const { records } = req.body;
    if (records && Array.isArray(records)) {
        database = database.concat(records);
        res.status(200).send({ message: 'Datos guardados correctamente.' });
    } else {
        res.status(400).send({ message: 'Formato de datos incorrecto.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en el puerto 3000');
});
