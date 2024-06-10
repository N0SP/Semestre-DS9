const express = require("express");
const app = express();
app.use(express.json());

// Pseudo - base de datos

const db = {
    ingresos: [],
    egresos: []
};

// Generar un ID único

const generarId = (() => {
    let id = 0;
    return () => id++;
})();

// Controlador para almanecenar un ingreso

app.post('/api/ingresos', (req, res) => {
    const ingreso = { id: generarId(), ...req.body };
    db.ingresos.push(ingreso);
    res.status(201).send(ingreso);
});

// Controlador para leer ingresos
app.get('/api/ingresos', (req, res) => { 
    res.json(db.ingresos);
});

// Controlador para almacenar un egreso

app.post('/api/egresos', (req, res) => {
    const egreso = { id: generarId(), ...req.body };
    db.egresos.push(egreso);
    res.status(201).send(egreso);
});

// Controlador para leer egresos
app.get('/api/egresos', (req, res) => {
    res.json(db.egresos);
});

const port = 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
