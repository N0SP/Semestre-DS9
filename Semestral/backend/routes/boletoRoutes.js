import express from 'express';
import { getAllBoletos, getBoleto } from '../controllers/boletoController.js';

const router = express.Router();

router.get('/', getAllBoletos);
router.get('/:id_evento', getBoleto);

export default router;
