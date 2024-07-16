import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';

import usuarioRoutes from './routes/usuarioRoutes.js';
import eventoRoutes from './routes/eventoRoutes.js';
import boletoRoutes from './routes/boletoRoutes.js';
import contactoRoutes from './routes/contactoRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import transaccionRoutes from './routes/transaccionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 4000;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.cookie('cookieName', 'cookieValue', {
    sameSite: 'None',
    secure: true
  });
  next();
});

// Rutas
app.use('/api/usuario', usuarioRoutes);
app.use('/api/evento', eventoRoutes);
app.use('/api/boleto', boletoRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/transaccion', transaccionRoutes);


app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});