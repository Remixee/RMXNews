/**
 * Snapchat Clip Scraper
 */
const Wreck = require('wreck');
const cheerio = require('cheerio');

module.exports = (url, cb) => {
    const options = {
        json: true,
        redirects: 3,
        headers: {
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36'
        }
    }

    //extract story Id
    if (!url.match(/(m:).*(\/)/)) {
        return cb();
    }

    let storyIdString = url.match(/(m:).*(\/)/)[0];
    let storyId = storyIdString.substr(0, storyIdString.length - 1);
    let storyJsonUrl = 'https://storysharing.snapchat.com/v1/fetch/';

    Wreck.get(storyJsonUrl + encodeURI(storyId) + '?request_origin=ORIGIN_WEB_PLAYER', options, (err, res, payload) => {
        let jsonRes = payload;

        let metadata = {
            title: jsonRes.story.metadata.title,
            description: '',
            overlay: (jsonRes.story.snaps[0].overlayImage) ? jsonRes.story.snaps[0].overlayImage.mediaUrl : '',
            image: jsonRes.story.snaps[0].media.mediaPreviewUrl,
            service: 'snapchat'
        }
        
        return cb(metadata);
    });
}