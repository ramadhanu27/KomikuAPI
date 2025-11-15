import { load } from 'cheerio';

const scrapeLatestUpdate = (html) => {
    const $ = load(html);
    const latestUpdate = [];
    
    $('.ls2j, .ls2').each((i, el) => {
        const $item = $(el);
        const $link = $item.find('a').first();
        const title = $item.find('h3, .jdl').first().text().trim();
        const url = $link.attr('href');
        const poster = $item.find('img').attr('src') || $item.find('img').attr('data-src');
        const chapterInfo = $item.find('.new1, .eps').text().trim();
        const date = $item.find('.date, .tgl').text().trim();
        
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
            latestUpdate.push({
                title,
                slug,
                poster: fixedPoster,
                chapter_info: chapterInfo,
                date_posted: date,
                url
            });
        }
    });
    
    return latestUpdate;
};

export default scrapeLatestUpdate;
