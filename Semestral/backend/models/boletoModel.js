import { pool } from '../database/connection.js';

// GET getAllBoletos
export async function obtenerBoletos() {
  try {
    const [result] = await pool.query('CALL ObtenerBoletos()');
    return result[0];
  } catch (error) {
    console.error('Error fetching obtenerBoletos:', error);
    throw error;
  }
}

// GET getBoletoById
export async function obtenerBoletosPorEventoId(id_evento) {
  try {
    const [result] = await pool.query('CALL ObtenerBoletosPorEventoId(?)', [id_evento]);
    return result[0];
  } catch (error) {
    console.error('Error fetching boletos:', error);
    throw error;
  }
}