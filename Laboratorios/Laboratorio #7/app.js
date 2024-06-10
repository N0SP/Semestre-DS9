const express = require('express');
const app = express();

// Funcion fibunacci
function fibonacci(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];

    const fibSeries = [0, 1];
    for (let i = 2; i < n; i++) {
        fibSeries.push(fibSeries[i - 1] + fibSeries[i - 2]);
    }
    return fibSeries;
}

// Endpoint para retornar la serie de fibonacci
app.get('/api/fibonacci/:n', (req, res) => {
    const n = parseInt(req.params.n, 10);
    if (isNaN(n) || n <= 0) {
        res.status(400).send('El parámetro debe ser un número entero no negativo');
        return;
    }
    const fibSeries = fibonacci(n);
    res.json(fibSeries);
});

// Iniciar el servidor
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});