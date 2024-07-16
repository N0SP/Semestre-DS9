import express from 'express';
const router = express.Router();

import * as faqController from '../controllers/faqController.js';

router.route('/')
    .get(faqController.getFaqs)

export default router;