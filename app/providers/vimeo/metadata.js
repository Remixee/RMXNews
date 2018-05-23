/**
 * Vimeo Metadata Scraper
 */
'use strict';
const Wreck = require('wreck');
const cheerio = require('cheerio');

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

        let metadata = {
            title: $("meta[property='og:title']").attr("content"),
            description: $("meta[property='og:description']").attr("content"),
            image: $("meta[property='og:image']").attr("content"),
            service: 'vimeo'
        }

        cb(metadata);
    });
}