import * as transactionModel from '../models/transaccionModel.js';

async function registrarTransaccion(req, res) {
  try {
    const result = await transactionModel.registrarTransaccion(req.body);
    res.status(201).json({ message: 'Transacción registrada correctamente', result });
  } catch (error) {
    res.status(500).json({ message: 'Error registrando la transacción: ' + error.message });
  }
}

async function obtenerHistorialCompraPorUsuario(req, res) {
  try {
    const result = await transactionModel.obtenerHistorialCompraPorUsuario(req);
    res.status(201).json({ success: true, result });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo el historial de compra: ' + error.message });
  }
}

export {
  registrarTransaccion,
  obtenerHistorialCompraPorUsuario
}

// export async function getTransacciones(req, res) {
//   try {
//     const result = await transactionModel.obtenerTransacciones();
//     res.status(200).json({ result });
//   } catch (error) {
//     res.status(500).json({ message: 'Error obteniendo las transacciones: ' + error.message });
//   }
// }

// export async function getTransaccion(req, res) {
//   try {
//     const { id } = req.params;
//     const result = await transactionModel.obtenerTransaccionPorId(id);
//     if (result) {
//       res.status(200).json({ result });
//     } else {
//       res.status(404).json({ message: 'Transacción no encontrada' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error obteniendo la transacción: ' + error.message });
//   }
// }
