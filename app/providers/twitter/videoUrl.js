/**
 * Twitter Post Url
 */

const Wreck = require('wreck');
const urlHelper = require('url');
const cheerio = require('cheerio');

// https://github.com/rg3/youtube-dl/issues/12726
// https://twitter.com/cnnbrk/status/993129040725921793

module.exports = (url, cb) => {
    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
    }

    //First page hit.
    Wreck.get(url, options, (err, res, payload) => {
        if (res.statusCode == 404) {
            console.error(err);
            return cb();
            // return reply(Boom.notFound('Twitter, video data not found', { url: url }));
        }
        else if (res.statusCode != 200) {
            return cb();
            // return reply(Boom.badRequest('Twitter, did not return correctly for whatever reason.', { status: res.statusCode }));
        }

        if (payload) {
            try {
                const $ = cheerio.load(payload.toString());
                let videos = [];
                let images = [];
                let timestamp = $('.js-short-timestamp').attr('data-time');

                [].forEach.call($('meta[property^="og:video"]'), function (el) {
                    var $el = $(el);
                    var propName = $el.attr('property');
                    var content = $el.attr('content');

                    if (propName === 'og:video' || propName === 'og:video:url') {
                        videos.push({ url: content });
                    }
                });

                Wreck.get(videos[0].url, options, (err, res, payload) => {
                    if (err) {
                        return cb();
                        // return reply(Boom.badData('Twitter, did not parse correctly for whatever reason.', { error: e }));
                    }
                    console.log(videos[0].url);
                    const $ = cheerio.load(payload.toString());
                    let videoData = $('#playerContainer').data('config');

                    if (videoData.video_url) {
                        return cb(url);
                    }
                    else if(videoData.videoInfo) {
                        return cb(videos[0].url);
                    }
                    else {
                        return cb();
                    }
                    
                })

            }
            catch (e) {
                return cb();
                // return reply(Boom.badData('Twitter, did not parse correctly for whatever reason.', { error: e }));
            }

        }
        else {
            return cb();
            // return reply(Boom.badData('Twitter, No payload or an error occured.', { error: err }));
        }
    });
}


