import * as boletoModel from '../models/boletoModel.js';

async function getAllBoletos(req, res) {
  try {
    const result = await boletoModel.obtenerBoletos();
    res.json({ status: 201, result: result });
  } catch (error) {
    res.json({ status: 500, message: 'Error getAllBoletos: ' + error.message });
  }
}

async function getBoleto(req, res) {
  try {
    const { id_evento } = req.params;
    const result = await boletoModel.obtenerBoletosPorEventoId(id_evento);
    if (result.length > 0) {
      res.json({ status: 201, message: 'Boletos obtenidos correctamente', result: result });
    } else {
      res.json({ status: 404, message: 'Boletos no registrados' });
    }
  } catch (error) {
    res.json({ status: 500, message: 'Error getBoleto: ' + error.message });
  }
}

export {
  getAllBoletos,
  getBoleto
}
