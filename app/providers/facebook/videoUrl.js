/**
 * Facebook Post Scraper
 */
'use strict';
const Wreck = require('wreck');
const cheerio = require('cheerio');
const Store = require('electron-store');

module.exports = (url, cb) => {
    const options = {
        redirects: 3,
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
        }
    }

    let mobileUrl = '';
    //Convert FB Video URLs into 'm.'
    if (url.indexOf('www.facebook') !== -1) {
        mobileUrl = url.replace(/www.facebook/g, "m.facebook");
    }
    else if (url.indexOf('://facebook') !== -1) {
        mobileUrl = url.replace(/:\/\/facebook/g, "://m.facebook");
    }

    Wreck.get(mobileUrl, options, (err, res, payload) => {
        let htmlOut = payload.toString();
        const $ = cheerio.load(htmlOut);
        let firstVid = $('meta[property^="og:type"]').get(0);
        let videoUrl = $('meta[property^="og:video"]').get(0);

        let store = new Store();
        let subscription = store.get('subscriptionPlan');

        if (firstVid.attribs.content == 'video') {
            if (subscription === 'lite') { 
                cb(videoUrl.attribs.content);
            }
            else {
                cb(mobileUrl);
            }
            
        }
        else {
            cb();
        }
    });
}