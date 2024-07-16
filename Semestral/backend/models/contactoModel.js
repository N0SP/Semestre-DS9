import { pool } from '../database/connection.js'

// POST sendMessage
export async function enviarMessage(req) {
    try {
        const { ID, Asunto, Detalles } = req.body;
        const [result] = await pool.query('CALL EnviarMensaje(?, ?, ?)', [ID, Asunto, Detalles]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error fetching enviarEmail:', error);
        throw error;
    }
}

// GET getMessages
export async function obtenerMensajes() {
    try {
        const [result] = await pool.query('CALL ObtenerMensajes()');
        return result[0];
    } catch (error) {
        console.error('Error fetching obtenerMensajes:', error);
        throw error;
    }
}

// POST getMessagesById
export async function obtenerMensajesPorId(req) {
    try {
        const { id } = req.params;
        const [result] = await pool.query('CALL ObtenerMensajesPorId(?)', [id]);
        return result[0];
    } catch (error) {
        console.error('Error fetching obtenerMensajesPorId:', error);
        throw error;
    }
}

// POST getMessagesByIdUser
export async function obtenerMensajesPorIdUsuario(req) {
    try {
        const { id } = req.params;
        const [result] = await pool.query('CALL ObtenerMensajesPorIdUsuario(?)', [id]);
        return result[0];
    } catch (error) {
        console.error('Error fetching obtenerMensajesPorIdUsuario:', error);
        throw error;
    }
}

// POST respondMessage
export async function responderMensaje(req) {
    try {
        const { Respuesta, ID_Contacto } = req.body;
        const [result] = await pool.query('CALL ResponderMensaje(?, ?)', [Respuesta, ID_Contacto]);        
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Error fetching responderMensaje:', error);
        throw error;
    }
}