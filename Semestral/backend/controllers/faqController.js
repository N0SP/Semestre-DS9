import * as faqModel from '../models/faqModel.js';

async function getFaqs(req, res) {
    try {
        const result = await faqModel.obtenerFaqs();
        if (result.length > 0) {
            res.json({ status: 201, result: result });
        } else {
            res.json({ status: 404, message: 'No hay faqs' });
        }
    } catch (error) { res.json({ status: 500, message: 'Error getFaqs: ' + error.message }); }
}

export {
    getFaqs
}