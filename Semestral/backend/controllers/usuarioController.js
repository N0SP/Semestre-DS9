import * as usuarioModel from '../models/usuarioModel.js';

async function getAllUsuario(req, res) {
  try {
    const result = await usuarioModel.obtenerTodosLosUsuarios();
    res.json({ status: 201, result: result });

  } catch (error) { res.json({ status: 500, message: 'Error getAllUsuario: ' + error.message }); }
}

async function createUsuario(req, res) {
  try {
    const existUser = await usuarioModel.obtenerUsuarioPorCorreo(req);

    if (existUser.length > 0) {
      return res.json({ status: 409, message: 'Correo ya registrado' });
    } else {
      const result = await usuarioModel.crearUsuario(req);
      if (result) {
        res.json({ status: 201, message: 'Usuario creado correctamente' });
      } else {
        res.json({ status: 404, message: 'Error al crear usuario' });
      }

    }

  } catch (error) { res.json({ status: 500, message: 'Error createUsuario: ' + error.message }); }
}

async function getUsuario(req, res) {
  try {
    const existUser = await usuarioModel.obtenerUsuarioPorCorreo(req);

    if (existUser.length > 0) {
      res.json({ status: 201, message: 'Usuario obtenido correctamente', result: existUser });
    }
    else {
      res.json({ status: 404, message: 'Usuario no registrado' });
    }

  } catch (error) { res.json({ status: 500, message: 'Error getUsuario: ' + error.message }); }
}

async function getUsuarioById(req, res) {
  try {
    const result = await usuarioModel.obtenerUsuarioPorId(req);
    res.json({ status: 201, result: result });

  } catch (error) { res.json({ status: 500, message: 'Error getUsuarioById: ' + error.message }); }
}

async function deleteUsuario(req, res) {
  try {
    const result = await usuarioModel.eliminarUsuario(req);
    if (result) {
      res.json({ status: 201, result: result });
    } else {
      res.json({ status: 404, message: 'Error al eliminar usuario' });
    }

  } catch (error) { res.json({ status: 500, message: 'Error deleteUsuario: ' + error.message }); }
}

async function updateUsuario(req, res) {
  try {
    const result = await usuarioModel.actualizarUsuario(req);
    if (result) {
      res.json({ status: 201, result: result });
    } else {
      res.json({ status: 404, message: 'Error al actualizar usuario' });
    }

  } catch (error) { res.json({ status: 500, message: 'Error updateUsuario: ' + error.message }); }
}

export {
  getAllUsuario,
  createUsuario,
  getUsuario,
  getUsuarioById,
  deleteUsuario,
  updateUsuario
};