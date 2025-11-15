import { load } from 'cheerio';
import scrapeMangaChapters from './scrapeMangaChapters.js';

const scrapeSingleManga = (html) => {
    const $ = load(html);
    
    // Title - multiple selectors
    const title = $('h1').first().text().trim() ||
                  $('.judul h1').first().text().trim() ||
                  $('h1[itemprop="name"]').first().text().trim() ||
                  $('#Judul h2').first().text().trim();
    
    // Alternative title
    let alternativeTitle = $('.judul .j2').text().trim() || '';
    
    // Synopsis
    const synopsis = $('p.desc').text().trim() ||
                     $('.desc').text().trim() ||
                     $('p[itemprop="description"]').text().trim() ||
                     $('.sin').text().trim();
    
    // Image
    const image = $('.ims img').attr('src') || 
                  $('.ims img').attr('data-src') ||
                  $('img[itemprop="image"]').attr('src');
    
    // Metadata from table
    let author = '';
    let status = '';
    let type = 'Manga';
    let released = '';
    let alternativeTitleFromTable = '';
    
    // Parse table.inftable
    $('table.inftable tr, .inftable tr').each((i, el) => {
        const $tds = $(el).find('td');
        if ($tds.length >= 2) {
            const key = $tds.eq(0).text().trim().toLowerCase();
            const value = $tds.eq(1).text().trim();
            
            if (key.includes('pengarang') || key.includes('author')) {
                author = value;
            } else if (key.includes('status')) {
                status = value;
            } else if (key.includes('jenis') || key.includes('type') || key.includes('komik')) {
                type = value;
            } else if (key.includes('umur pembaca') || key.includes('umur') || key.includes('released') || key.includes('terbit')) {
                released = value;
            } else if (key.includes('judul indonesia') || key.includes('alternative') || key === 'judul indonesia') {
                alternativeTitleFromTable = value;
            }
        }
    });
    
    // Genres
    const genres = [];
    $('ul.genre li.genre').each((i, el) => {
        const genre = $(el).find('a span[itemprop="genre"]').text().trim() ||
                    $(el).find('a').text().trim();
        if (genre) genres.push(genre);
    });
    
    // Chapters
    const chapter_lists = scrapeMangaChapters(html);
    
    // Use alternative title from table if found
    if (alternativeTitleFromTable) {
        alternativeTitle = alternativeTitleFromTable;
    }
    
    return {
        title,
        alternativeTitle,
        slug: extractSlugFromUrl($('link[rel="canonical"]').attr('href') || ''),
        poster: image,
        synopsis,
        author,
        type,
        status,
        released,
        genres,
        chapter_lists,
        total_chapters: chapter_lists.length
    };
};

const extractSlugFromUrl = (url) => {
    if (!url) return '';
    const match = url.match(/manga\/([^\/]+)\//);
    return match ? match[1] : '';
};

export default scrapeSingleManga;
