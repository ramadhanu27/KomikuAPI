import { load } from 'cheerio';

const scrapeSearchResult = (html) => {
    const $ = load(html);
    const results = [];
    
    // Search results from Komiku
    $('.bge .bgei, .daftar .bge, .search-result .bge').each((i, el) => {
        const $item = $(el);
        const $link = $item.find('a').first();
        const title = $item.find('h3, .kan, .jdl').first().text().trim() || $link.find('h3').text().trim();
        const url = $link.attr('href');
        const poster = $item.find('img').attr('src') || $item.find('img').attr('data-src');
        const type = $item.find('.tpe1, .type').text().trim();
        const chapterInfo = $item.find('.new1, .chapter-info').text().trim();
        
        // Extract slug from URL
        let slug = '';
        if (url) {
            const match = url.match(/manga\/([^\/]+)\//);
            slug = match ? match[1] : '';
        }
        
        // Fix poster URL if relative
        let fixedPoster = poster;
        if (poster && !poster.startsWith('http')) {
            fixedPoster = `https://komiku.org${poster}`;
        }
        
        if (title && url) {
            results.push({
                title,
                slug,
                poster: fixedPoster,
                type: type || 'Manga',
                chapter_info: chapterInfo,
                url
            });
        }
    });
    
    return results;
};

export default scrapeSearchResult;
