import express from 'express';
import * as eventoController from '../controllers/eventoController.js';

const router = express.Router();

router.route('/')
  .get(eventoController.getEvents);

router.route('/:id')
  .get(eventoController.getEvent);

router.route('/status')
  .put(eventoController.updateStatus);

router.route('/eventos')
  .post(eventoController.createEvento);

export default router;
