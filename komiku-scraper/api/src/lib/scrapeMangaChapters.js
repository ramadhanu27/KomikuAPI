import { load } from 'cheerio';

const scrapeMangaChapters = (html) => {
    const $ = load(html);
    const chapters = [];
    
    // Scrape chapters from table
    $('#Daftar_Chapter tbody._3Rsjq tr, #Daftar_Chapter tbody tr').each((i, el) => {
        const $row = $(el);
        const $link = $row.find('td.judulseries a, td a');
        
        const chapterTitle = $link.text().trim();
        let chapterUrl = $link.attr('href');
        
        // Extract chapter number
        const chapterMatch = chapterTitle.match(/Chapter\s+(\d+)/i);
        const chapterNumber = chapterMatch ? chapterMatch[1] : '';
        
        const date = $row.find('td.tanggalseries, td:last-child').text().trim();
        
        // Fix URL if relative
        if (chapterUrl && !chapterUrl.startsWith('http')) {
            chapterUrl = `https://komiku.org${chapterUrl}`;
        }
        
        if (chapterUrl && chapterTitle) {
            chapters.push({
                chapter: chapterNumber,
                title: chapterTitle,
                url: chapterUrl,
                date_posted: date
            });
        }
    });
    
    // Fallback selector
    if (chapters.length === 0) {
        $('.chapter-list .judulseries, #Daftar_Chapter .judulseries').each((i, el) => {
            const $link = $(el).find('a');
            const chapterTitle = $link.text().trim();
            let chapterUrl = $link.attr('href');
            const chapterNumber = chapterTitle.match(/Chapter\s+(\d+\.?\d*)/i)?.[1] ||
                                 chapterTitle.match(/(\d+\.?\d*)/)?.[1] || '';
            const date = $(el).find('.date, .tanggalseries').text().trim();
            
            if (chapterUrl && !chapterUrl.startsWith('http')) {
                chapterUrl = `https://komiku.org${chapterUrl}`;
            }
            
            if (chapterUrl) {
                chapters.push({
                    chapter: chapterNumber,
                    title: chapterTitle,
                    url: chapterUrl,
                    date_posted: date
                });
            }
        });
    }
    
    return chapters.reverse(); // Latest first
};

export default scrapeMangaChapters;
