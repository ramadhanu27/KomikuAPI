import axios from 'axios';
import { load } from 'cheerio';
import scrapeOngoingManga from '../lib/scrapeOngoingManga.js';

const BASEURL = process.env.BASEURL || 'https://komiku.org';
console.log('🔗 Komiku Base URL:', BASEURL);

const home = async () => {
    try {
        const { data } = await axios.get(BASEURL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });

        // Ambil seluruh HTML halaman dan biarkan helper yang mem-parsing struktur terbaru
        const html = data;
        const allList = scrapeOngoingManga(html);

        // Untuk saat ini, gunakan list yang sama dan bagi ke tiga section
        const ongoing_manga = allList.slice(0, 10);
        const complete_manga = allList.slice(10, 20);
        const latest_update = allList.slice(20, 30);

        return {
            ongoing_manga,
            complete_manga,
            latest_update
        };
    } catch (error) {
        console.error('❌ Error scraping home:', error.message);
        throw error;
    }
};

export default home;
