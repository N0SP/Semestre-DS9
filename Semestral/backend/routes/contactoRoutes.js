import express from 'express';
const router = express.Router();

import * as contactoController from '../controllers/contactoController.js';

router.route('/')
    .post(contactoController.sendMessage)

router.route('/all')
    .get(contactoController.getMessages)

router.route('/response')
    .post(contactoController.respondMessage)

router.route('/:id')
    .post(contactoController.getMessagesById)

router.route('/user/:id')
    .post(contactoController.getMessagesByIdUser)

export default router;