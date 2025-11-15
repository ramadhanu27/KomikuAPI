import axios from 'axios';
import scrapeSearchResult from '../lib/scrapeSearchResult.js';

const BASEURLS = [
    process.env.BASEURL,
    'https://komiku.org',
    'https://komiku.id',
    'https://komiku.co.id'
].filter(Boolean);

const client = axios.create({
    timeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
    }
});

const manhwa = async (page = 1) => {
    for (const base of BASEURLS) {
        const url = `${base}/type/manhwa/page/${page}/`;
        try {
            console.log(`🇰🇷 Scraping manhwa: ${url}`);
            const { data } = await client.get(url);
            console.log(`✅ Berhasil dari: ${url}`);
            const results = scrapeSearchResult(data);
            return results.filter(manga => manga.type && manga.type.toLowerCase().includes('manhwa'));
        } catch (error) {
            console.error(`⚠️ Gagal: ${url} — ${error.code || error.message}`);
        }
    }
    throw new Error('❌ Tidak bisa mengakses manhwa dari salah satu domain.');
};

export default manhwa;
