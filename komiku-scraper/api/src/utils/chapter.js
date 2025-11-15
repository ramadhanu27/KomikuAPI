import axios from 'axios';
import { load } from 'cheerio';

const BASEURL = process.env.BASEURL || 'https://komiku.org';

const chapter = async (slug, chapterNumber) => {
    try {
        const url = `${BASEURL}/chapter/${slug}-chapter-${chapterNumber}/`;
        console.log(`📄 Scraping chapter: ${url}`);
        
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
            }
        });
        
        const $ = load(data);
        const images = [];
        
        // Extract chapter images
        $('#Baca_Komik img[itemprop="image"]').each((index, element) => {
            const $img = $(element);
            const imageUrl = $img.attr('src') || $img.attr('data-src');
            
            if (imageUrl && !imageUrl.includes('loading') && !imageUrl.includes('icon')) {
                images.push({
                    page: index + 1,
                    url: imageUrl,
                    filename: `page-${String(index + 1).padStart(3, '0')}.jpg`
                });
            }
        });
        
        // Fallback selector
        if (images.length === 0) {
            $('#Baca_Komik img').each((index, element) => {
                const $img = $(element);
                const imageUrl = $img.attr('src') || $img.attr('data-src');
                
                if (imageUrl && !imageUrl.includes('loading') && !imageUrl.includes('icon')) {
                    images.push({
                        page: index + 1,
                        url: imageUrl,
                        filename: `page-${String(index + 1).padStart(3, '0')}.jpg`
                    });
                }
            });
        }
        
        // Chapter metadata
        const chapterTitle = $('h1, .judul h1, .chapter-title').first().text().trim();
        const prevChapter = $('.prevchap a, .prev a').attr('href');
        const nextChapter = $('.nextchap a, .next a').attr('href');
        
        return {
            chapter_title: chapterTitle,
            chapter_number: chapterNumber,
            images,
            navigation: {
                prev_chapter: prevChapter,
                next_chapter: nextChapter
            }
        };
    } catch (error) {
        console.error(`❌ Error scraping chapter ${slug} ${chapterNumber}:`, error.message);
        throw error;
    }
};

export default chapter;
