import { Router } from 'express';
import api from './api.js';

const routes = Router();

routes.get('/', (_, res) => {
    res.status(200).json({ 
        status: 'Ok', 
        message: '🔥 Komiku Real-time Scraper API',
        version: '1.0.0',
        source: 'https://komiku.org'
    });
});

routes.use('/v1', api);

routes.use((_, res) => {
    res.status(404).json({ 
        status: 'Error', 
        message: 'Endpoint not found 🚫' 
    });
});

export default routes;
