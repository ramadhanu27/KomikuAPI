import axios from 'axios';
import { load } from 'cheerio';
import scrapeSearchResult from '../lib/scrapeSearchResult.js';

const BASEURL = process.env.BASEURL || 'https://komiku.org';

const manhwa = async (page = 1) => {
    try {
        const url = `${BASEURL}/type/manhwa/page/${page}/`;
        console.log(`🇰🇷 Scraping manhwa: ${url}`);
        
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });
        
        const results = scrapeSearchResult(data);
        return results.filter(manga => manga.type.toLowerCase().includes('manhwa'));
    } catch (error) {
        console.error('❌ Error scraping manhwa:', error.message);
        throw error;
    }
};

export default manhwa;
