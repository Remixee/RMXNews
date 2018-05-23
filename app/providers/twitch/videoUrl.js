/**
 * Twitch Clip Scraper
 */
const Wreck = require('wreck');
const cheerio = require('cheerio');

//Need to update and use API Key. OG Data no longer loading up front.
module.exports = (url, cb) => {
    const options = {
        redirects: 3,
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
        }
    }

    Wreck.get(url, options, (err, res, payload) => {
        let htmlOut = payload.toString();
        const $ = cheerio.load(htmlOut);

        if (!$("meta[property='og:image']").attr("content")) {
            return cb();
        }

        let videoUrl = $("meta[property='og:image']").attr("content").replace('-social-preview.jpg', '.mp4');
        cb(videoUrl);
    });
}