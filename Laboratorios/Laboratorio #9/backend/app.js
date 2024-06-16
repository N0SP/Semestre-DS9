import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Please use a POST request instead.' });
});

app.post('/', (req, res) => {
    const numero = req.body.numero;
    if (typeof numero !== 'number' || numero < 1) {
        return res.status(400).json({ message: 'Número inválido, debe ser un número positivo mayor que 0.' });
    }

    const fibonacciSequence = generarTarjetasFibonacci(numero);
    res.json({ secuencia: fibonacciSequence });
});

app.listen(port, () => {
    console.log(`Corriendo en el puerto http://localhost:${port}`);
});

function generarTarjetasFibonacci(maxValue) {
    let fibonacciAnterior = 0;
    let fibonacciActual = 1;
    const secuencia = [fibonacciAnterior];

    while (fibonacciActual < maxValue) {
        secuencia.push(fibonacciActual);
        const fibonacciSiguiente = fibonacciAnterior + fibonacciActual;
        fibonacciAnterior = fibonacciActual;
        fibonacciActual = fibonacciSiguiente;
    }

    return secuencia;
}
