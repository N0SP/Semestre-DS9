import express from 'express';
const router = express.Router();

import * as transaccionController from '../controllers/transaccionController.js';

// Definición de las rutas para las transacciones
router.route('/')
    .post(transaccionController.registrarTransaccion);

router.route('/:id')
    .get(transaccionController.obtenerHistorialCompraPorUsuario)

// router.get('/', getTransacciones);       
// router.get('/:id', getTransaccion);

export default router;