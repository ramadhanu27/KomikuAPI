import axios from 'axios';
import { load } from 'cheerio';

const BASEURL = process.env.BASEURL || 'https://komiku.org';

const genreLists = async () => {
    try {
        const { data } = await axios.get(`${BASEURL}/genre/`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });
        
        const $ = load(data);
        const genres = [];
        
        $('.genre-list a, .genre a, ul.genre li a').each((i, el) => {
            const $link = $(el);
            const name = $link.text().trim();
            const url = $link.attr('href');
            
            if (name && url) {
                // Extract slug from URL
                let slug = '';
                const match = url.match(/genre\/([^\/]+)\//);
                slug = match ? match[1] : '';
                
                genres.push({
                    name,
                    slug,
                    url
                });
            }
        });
        
        return genres;
    } catch (error) {
        console.error('❌ Error scraping genre lists:', error.message);
        throw error;
    }
};

export default genreLists;
