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

const chapter = async (slug, chapterNumber) => {
    for (const base of BASEURLS) {
        const url = `${base}/chapter/${slug}-chapter-${chapterNumber}/`;
        try {
            console.log(`📄 Scraping chapter: ${url}`);
            const { data } = await client.get(url);
            
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
            
            console.log(`✅ Berhasil dari: ${url}`);
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
            console.error(`⚠️ Gagal: ${url} — ${error.code || error.message}`);
        }
    }
    throw new Error(`❌ Tidak bisa mengakses chapter ${slug} ${chapterNumber} dari salah satu domain.`);
};

export default chapter;
