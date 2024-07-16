import { pool } from '../database/connection.js';

// GET getEvents
export async function obtenerEventos() {
  try {
    const [result] = await pool.query('CALL ObtenerEventos()');
    return result[0];
  } catch (error) {
    console.error('Error fetching obtenerEventos:', error);
    throw error;
  }
}

// GET getEventById
export async function obtenerEventoPorId(req) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('CALL ObtenerEventoPorId(?)', [id]);
    return result[0];
  } catch (error) {
    console.error('Error fetching obtenerEventoPorId:', error);
    throw error;
  }
}

// POST updateStatus
export async function actualizarStatus(req) {
  try {
    const { ID_Evento, Status } = req.body;
    const [result] = await pool.query('CALL ActualizarStatus(?, ?)', [ID_Evento, Status]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error fetching actualizarStatus:', error);
    throw error;
  }
}

// POST createEvento
export async function crearEvento(req) {
  try {
    const { name, place, startdate, enddate, details, image, id_promotor, seatpriceplatino, seatpricegold, seatpricesilver, seatpricegeneral, seatquantityplatino, seatquantitygold, seatquantitysilver, seatquantitygeneral } = req;

    console.log('Datos recibidos para crear evento:', { name, place, startdate, enddate, details, image, id_promotor, seatpriceplatino, seatpricegold, seatpricesilver, seatpricegeneral, seatquantityplatino, seatquantitygold, seatquantitysilver, seatquantitygeneral});
    
    const [result] = await pool.query('CALL CrearEventoNew(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, place, image, details, startdate, enddate, id_promotor, seatpriceplatino, seatquantityplatino, seatpricegold, seatquantitygold, seatpricesilver, seatquantitysilver, seatpricegeneral, seatquantitygeneral]);
    
    if (result) {
      console.log('Evento y boletos creados correctamente');
      return true;
    }
    
    console.log('Error al crear el evento y los boletos');
    return false;
  } catch (error) {
    console.error('Error creando el evento y los boletos:', error);
    throw error;
  }
}
