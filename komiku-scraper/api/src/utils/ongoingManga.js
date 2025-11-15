import axios from 'axios';
import scrapeOngoingManga from '../lib/scrapeOngoingManga.js';

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

const ongoingManga = async () => {
    for (const base of BASEURLS) {
        try {
            console.log(`🔍 Mencoba fetch dari: ${base}`);
            const { data } = await client.get(base);
            console.log(`✅ Berhasil dari: ${base}`);
            return scrapeOngoingManga(data);
        } catch (error) {
            console.error(`⚠️ Gagal: ${base} — ${error.code || error.message}`);
        }
    }
    throw new Error('❌ Tidak bisa mengakses salah satu domain Komiku.');
};

export default ongoingManga;
