import * as eventoModel from '../models/eventoModel.js';
import { cloudinary } from '../config/cloudinary.js';

async function createEvento(req, res) {
  try {
    const { name, place, startdate, enddate, details, image, id_promotor, seatpriceplatino, seatpricegold, seatpricesilver, seatpricegeneral, seatquantityplatino, seatquantitygold, seatquantitysilver, seatquantitygeneral } = req.body;

    if (!name || !place || !startdate || !enddate || !details || !image || !id_promotor ||
        !seatpriceplatino || !seatpricegold || !seatpricesilver || !seatpricegeneral || !seatquantityplatino || !seatquantitygold || !seatquantitysilver || !seatquantitygeneral) {
      return res.json({ status: 400, message: 'Todos los campos son obligatorios' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: 'eventazo'
    }).catch(err => {
      console.error('Error uploading to Cloudinary:', err);
      throw new Error('no se pudo subir la imagen al servidor');
    });

    // Obtener el enlace de la imagen subida
    const imageUrl = uploadResponse.secure_url;

    // Crear el evento con el enlace de la imagen
    const result = await eventoModel.crearEvento({
      name,
      place,
      startdate,
      enddate,
      details,
      image: imageUrl,
      id_promotor,
      seatpriceplatino,
      seatpricegold,
      seatpricesilver,
      seatpricegeneral,
      seatquantityplatino,
      seatquantitygold,
      seatquantitysilver,
      seatquantitygeneral
    });

    if (result) {
      res.json({ status: 201, message: 'Evento creado correctamente' });
    } else {
      res.json({ status: 404, message: 'Evento no registrado' });
    }
  } catch (error) {
    res.json({ status: 500, message: 'Error creando el evento: ' + error.message });
  }
}


async function getEvents(req, res) {
  try {
    const result = await eventoModel.obtenerEventos();
    res.json({ status: 201, result: result });
  } catch (error) {
    res.json({ status: 500, message: 'Error getEvents: ' + error.message });
  }
}

async function getEvent(req, res) {
  try {
    const existEvent = await eventoModel.obtenerEventoPorId(req);

    if (existEvent.length > 0) {
      res.json({ status: 201, message: 'Evento obtenido correctamente', result: existEvent });
    } else {
      res.json({ status: 404, message: 'Evento no registrado' });
    }
  } catch (error) {
    res.json({ status: 500, message: 'Error getEvent: ' + error.message });
  }
}

async function updateStatus(req, res) {
  try {
    const result = await eventoModel.actualizarStatus(req);
    res.json({ status: 201, message: 'Status actualizado correctamente', result: result });
  } catch (error) {
    res.json({ status: 500, message: 'Error updateStatus: ' + error.message });
  }
}


export {
  createEvento,
  getEvents,
  getEvent,
  updateStatus,
}
