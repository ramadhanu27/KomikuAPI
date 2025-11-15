import axios from 'axios';
import scrapeCompleteManga from '../lib/scrapeCompleteManga.js';

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

const completeManga = async () => {
    for (const base of BASEURLS) {
        const url = `${base}/daftar-komik/`;
        try {
            console.log(`🔍 Mencoba fetch dari: ${url}`);
            const { data } = await client.get(url);
            console.log(`✅ Berhasil dari: ${url}`);
            return scrapeCompleteManga(data);
        } catch (error) {
            console.error(`⚠️ Gagal: ${url} — ${error.code || error.message}`);
        }
    }
    throw new Error('❌ Tidak bisa mengakses salah satu domain Komiku.');
};

export default completeManga;
