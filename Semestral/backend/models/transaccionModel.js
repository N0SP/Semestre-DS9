import { pool } from '../database/connection.js';

export async function registrarTransaccion(transaccion) {
  const { transactionId, payerName, payerEmail, amount, currency, status, eventoId, usuarioId, platino, gold, silver, general } = transaccion;

  try {
    const query = `
      CALL registrarTransaccion(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [transactionId, payerName, payerEmail, amount, currency, status, eventoId, usuarioId, platino, gold, silver, general];
    const [result] = await pool.query(query, params);

    console.log('Stored procedure result:', result); // Añadido para depuración

    return result; // Devolver el resultado completo para fines de depuración
  } catch (error) {
    console.error('Error registrando la transacción:', error);
    throw error;
  }
}

//ObtenerHistorialCompraPorUsuario
export async function obtenerHistorialCompraPorUsuario(req) {
  const { id } = req.params;
  try {
    const [result] = await pool.query('CALL ObtenerHistorialCompraPorUsuario(?)', [id]);
    return result[0];
  } catch (error) {
    console.error('Error fetching historial de compra:', error);
    throw error;
  }
}
