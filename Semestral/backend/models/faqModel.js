import { pool } from '../database/connection.js'

// GET getFaqs
export async function obtenerFaqs() {
    try {
        const [result] = await pool.query('CALL ObtenerFaqs()');
        return result[0];
    } catch (error) {
        console.error('Error fetching obtenerFaqs:', error);
        throw error;
    }
}