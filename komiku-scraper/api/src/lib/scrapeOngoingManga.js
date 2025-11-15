import { load } from 'cheerio';

const scrapeOngoingManga = (html) => {
    const $ = load(html);
    const list = [];

    // Struktur baru homepage Komiku menggunakan blok .ls2 (list item)
    $('.ls2').each((i, el) => {
        const $item = $(el);

        // poster biasanya ada di .ls2v img
        const poster = $item.find('.ls2v img').attr('data-src') ||
                       $item.find('.ls2v img').attr('src') || '';

        // judul + link ada di .ls2j h3/h4 a
        const $titleLink = $item.find('.ls2j h3 a, .ls2j h4 a, h3 a, h4 a').first();
        const title = $titleLink.text().trim();
        const url = $titleLink.attr('href');

        // info chapter / teks tambahan biasanya di span.ls2t
        const chapterInfo = $item.find('.ls2t').first().text().trim();

        if (!title || !url) return;

        // Extract slug dari URL /manga/slug/
        let slug = '';
        const match = url.match(/manga\/([^\/]+)\//);
        if (match) slug = match[1];

        // Perbaiki poster jika relative
        let fixedPoster = poster;
        if (fixedPoster && !fixedPoster.startsWith('http')) {
            fixedPoster = `https://komiku.org${fixedPoster}`;
        }

        list.push({
            title,
            slug,
            poster: fixedPoster,
            type: 'Manga',
            chapter_info: chapterInfo,
            url
        });
    });

    return list;
};

export default scrapeOngoingManga;
