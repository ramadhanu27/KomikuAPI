import { Router } from 'express';
import komiku from '../src/komiku.js';

const api = Router();

// Root API info
api.get('/', (_, res) => {
    res.status(200).json({
        status: 'OK',
        message: '🔥 Komiku Real-time Scraper API',
        endpoints: [
            'GET /v1/home - Homepage data',
            'GET /v1/search/:keyword - Search manga',
            'GET /v1/manga/:slug - Manga detail',
            'GET /v1/manga/:slug/chapters - Chapter list',
            'GET /v1/chapter/:slug/:number - Chapter images',
            'GET /v1/ongoing-manga - Ongoing manga',
            'GET /v1/complete-manga - Complete manga',
            'GET /v1/manhwa - Manhwa list',
            'GET /v1/manhua - Manhua list',
            'GET /v1/genres - Genre list',
            'GET /v1/genres/:slug/:page - Manga by genre'
        ]
    });
});

// Home - ongoing, complete, latest update
api.get('/home', async (req, res) => {
    try {
        const data = await komiku.home();
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Home API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch home data' });
    }
});

// Search manga
api.get('/search/:keyword', async (req, res) => {
    try {
        const { keyword } = req.params;
        const data = await komiku.search(keyword);
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Search API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to search manga' });
    }
});

// Manga detail
api.get('/manga/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await komiku.manga(slug);
        
        if (!data) {
            return res.status(404).json({ status: 'Error', message: 'Manga not found' });
        }
        
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Manga detail API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch manga detail' });
    }
});

// Manga chapters
api.get('/manga/:slug/chapters', async (req, res) => {
    try {
        const { slug } = req.params;
        const data = await komiku.chapters(slug);
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Chapters API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch chapters' });
    }
});

// Ongoing manga
api.get('/ongoing-manga', async (req, res) => {
    try {
        const data = await komiku.ongoingManga();
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Ongoing manga API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch ongoing manga' });
    }
});

// Complete manga
api.get('/complete-manga', async (req, res) => {
    try {
        const data = await komiku.completeManga();
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Complete manga API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch complete manga' });
    }
});

// Chapter images
api.get('/chapter/:slug/:number', async (req, res) => {
    try {
        const { slug, number } = req.params;
        const data = await komiku.chapter(slug, number);
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Chapter API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch chapter images' });
    }
});

// Manhwa list
api.get('/manhwa', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const data = await komiku.manhwa(page);
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Manhwa API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch manhwa' });
    }
});

// Manhua list
api.get('/manhua', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const data = await komiku.manhua(page);
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Manhua API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch manhua' });
    }
});

// Genre lists
api.get('/genres', async (req, res) => {
    try {
        const data = await komiku.genreLists();
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Genres API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch genres' });
    }
});

// Manga by genre
api.get('/genres/:slug/:page?', async (req, res) => {
    try {
        const { slug } = req.params;
        const page = parseInt(req.params.page) || 1;
        const data = await komiku.mangaByGenre(slug, page);
        res.status(200).json({ status: 'Ok', data });
    } catch (error) {
        console.error('Manga by genre API error:', error);
        res.status(500).json({ status: 'Error', message: 'Failed to fetch manga by genre' });
    }
});

export default api;
