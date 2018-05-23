/**
 * Vimeo Scraper
 */
// const Boom = require('boom');
const Wreck = require('wreck');

module.exports = (url, cb) => {
    let vimeo = {};

    Wreck.get(url, { redirects: 3 }, (err, res, payload) => {
        if (res.statusCode == 404) {
            return cb();
            // return reply(Boom.badData('Vimeo, video data not found', { url: url }));
        }
        else if (res.statusCode != 200) {
            return cb();
            // return reply(Boom.badRequest('Vimeo, did not return correctly for whatever reason.', { status: res.statusCode }));
        }

        if (payload) {
            //Try to find the configuration file URL.
            try {
                let htmlOut = payload.toString();
                let vimeoPostData = htmlOut.match(/window.vimeo.clip_page_config = (.*);/)[1];
                vimeo = JSON.parse(vimeoPostData);
            }
            catch (e) {
                // return reply(Boom.badData('Vimeo, did not parse correctly for whatever reason.', { error: e }));
            }

            if(!vimeo.player) {
                return cb();
            }

            //Follow the first URL to the player configuration file.
            Wreck.get(vimeo.player.config_url, (err, res, payload) => {

                if (res.statusCode == 404) {
                    // return reply(Boom.badData('Vimeo, video data not found', { url: url }));
                }
                else if (res.statusCode != 200) {
                    // return reply(Boom.badRequest('Vimeo, did not return correctly for whatever reason.', { status: res.statusCode }));
                }
                //Finally parse the payload.
                try {
                    payload = JSON.parse(payload);

                    let results = {
                        media: {
                            external_vid_url: payload.request.files.progressive[2].url,
                            duration: payload.video.duration.toString(),
                            thumbnail: payload.video.thumbs['640'],
                            type: 'video'
                        },
                        username: vimeo.owner.display_name,
                        service: 'vimeo',
                        url: vimeo.player.config_url.substring(0, vimeo.player.config_url.indexOf("/config")),
                        caption: vimeo.clip.title,
                        timestamp: vimeo.clip.uploaded_on
                    }

                    return cb(payload.request.files.progressive[2].url);
                }
                catch (e) {
                    return cb();
                    // return reply(Boom.badData('Vimeo, did not parse correctly for whatever reason.', { error: e }));
                }
            });
        }
        else {
            return cb();
            // return reply(Boom.badData('Vimeo, No payload or an error occured.', { error: err }));
        }
    });
}
