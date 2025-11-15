import { load } from 'cheerio';
import axios from 'axios';

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

const genreLists = async () => {
    for (const base of BASEURLS) {
        const url = `${base}/genre/`;
        try {
            console.log(`🔍 Scraping genres: ${url}`);
            const { data } = await client.get(url);
            
            const $ = load(data);
            const genres = [];
            
            $('.genre-list a, .genre a, ul.genre li a').each((i, el) => {
                const $link = $(el);
                const name = $link.text().trim();
                const genreUrl = $link.attr('href');
                
                if (name && genreUrl) {
                    // Extract slug from URL
                    let slug = '';
                    const match = genreUrl.match(/genre\/([^\/]+)\//);
                    slug = match ? match[1] : '';
                    
                    genres.push({
                        name,
                        slug,
                        url: genreUrl
                    });
                }
            });
            
            console.log(`✅ Berhasil dari: ${url}`);
            return genres;
        } catch (error) {
            console.error(`⚠️ Gagal: ${url} — ${error.code || error.message}`);
        }
    }
    throw new Error('❌ Tidak bisa mengakses genre lists dari salah satu domain.');
};

export default genreLists;
