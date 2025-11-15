import axios from 'axios';
import { load } from 'cheerio';
import scrapeCompleteManga from '../lib/scrapeCompleteManga.js';

const BASEURL = process.env.BASEURL || 'https://komiku.org';

const completeManga = async () => {
    try {
        const { data } = await axios.get(`${BASEURL}/daftar-komik/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });
        
        return scrapeCompleteManga(data);
    } catch (error) {
        console.error('❌ Error scraping complete manga:', error.message);
        throw error;
    }
};

export default completeManga;
