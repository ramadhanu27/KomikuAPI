import { load } from "cheerio";

const scrapeCompleteManga = (html, baseUrl = "https://komiku.org") => {
    const $ = load(html);
    const completeManga = [];

    $(".bgei, .ls1, .ls4").each((i, el) => {
        const $item = $(el);

        // Ambil link utama
        const $link = $item.find("a").first();
        const url = $link.attr("href");

        if (!url) return; // jika tidak ada url skip

        // Pastikan URL absolut
        const absoluteUrl = url.startsWith("http") ? url : baseUrl + url;

        // Judul
        const title =
            $item.find("h3").text().trim() ||
            $item.find(".kan").text().trim() ||
            $item.find("img").attr("alt") ||
            "Unknown Title";

        // Poster (src atau data-src)
        let poster =
            $item.find("img").attr("src") ||
            $item.find("img").attr("data-src") ||
            null;

        if (poster && !poster.startsWith("http")) {
            poster = baseUrl + poster;
        }

        // Type / genre kecil (kadang beda class)
        const type =
            $item.find(".tpe1").text().trim() ||
            $item.find(".genre").text().trim() ||
            "Manga";

        // Chapter / informasi update
        const chapterInfo =
            $item.find(".new1").text().trim() ||
            $item.find(".latest").text().trim() ||
            "";

        // Slug extractor universal
        let slug = "";
        const slugMatch = absoluteUrl.match(/(?:manga|komik)\/([^\/]+)/i);
        if (slugMatch) slug = slugMatch[1];

        completeManga.push({
            title,
            slug,
            poster,
            type,
            chapter_info: chapterInfo,
            status: "Completed",
            url: absoluteUrl,
        });
    });

    return completeManga;
};

export default scrapeCompleteManga;
