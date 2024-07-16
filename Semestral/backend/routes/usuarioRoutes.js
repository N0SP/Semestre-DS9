import express from 'express';
const router = express.Router();

import * as usuarioController from '../controllers/usuarioController.js';

router.route('/')
    .get(usuarioController.getAllUsuario)
    .post(usuarioController.createUsuario)

router.route('/login')
    .post(usuarioController.getUsuario)

router.route('/update')
    .post(usuarioController.updateUsuario)

router.route('/delete/:id')
    .post(usuarioController.deleteUsuario)

router.route('/:id')
    .post(usuarioController.getUsuarioById)

export default router;