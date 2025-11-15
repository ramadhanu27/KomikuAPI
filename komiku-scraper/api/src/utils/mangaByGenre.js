import axios from 'axios';
import { load } from 'cheerio';
import scrapeSearchResult from '../lib/scrapeSearchResult.js';

const BASEURL = process.env.BASEURL || 'https://komiku.org';

const mangaByGenre = async (genreSlug, page = 1) => {
    try {
        const url = `${BASEURL}/genre/${genreSlug}/page/${page}/`;
        console.log(`📚 Scraping manga by genre: ${url}`);
        
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });
        
        return scrapeSearchResult(data);
    } catch (error) {
        console.error(`❌ Error scraping manga by genre ${genreSlug}:`, error.message);
        throw error;
    }
};

export default mangaByGenre;
