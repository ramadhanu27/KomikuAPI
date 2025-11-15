import axios from 'axios';
import scrapeSingleManga from '../lib/scrapeSingleManga.js';

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

const manga = async (slug) => {
    for (const base of BASEURLS) {
        const url = `${base}/manga/${slug}/`;
        try {
            console.log(`📖 Scraping manga: ${url}`);
            const { data } = await client.get(url);
            console.log(`✅ Berhasil dari: ${url}`);
            return scrapeSingleManga(data);
        } catch (error) {
            console.error(`⚠️ Gagal: ${url} — ${error.code || error.message}`);
        }
    }
    throw new Error(`❌ Tidak bisa mengakses manga ${slug} dari salah satu domain.`);
};

export default manga;
