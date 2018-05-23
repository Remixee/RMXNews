/**
 * YouTube Scraper
 */
const Wreck = require('wreck');

module.exports = (url, cb) => {
    Wreck.get(url , {}, (err, res, payload) => {

        if(res.statusCode == 404) {
            // return reply(Boom.badData('Youtube, video data not found', { url: url }));
        }
        else if(res.statusCode == 303) {
            // return reply(Boom.expectationFailed('Youtube, sent us on a weird redirect path', { url: url }));
        }
        else if(res.statusCode != 200) {
            // return reply(Boom.badRequest('Youtube, did not return correctly for whatever reason.', { status: res.statusCode }));
        }

        if(payload) {
            try {
                let htmlOut = payload.toString();
                let ytPostData = htmlOut.match(/ytplayer.config = (.*);ytplayer.load/)[1];
                let yt = JSON.parse(ytPostData);

                let metadata = {
                    title: yt.args.author,
                    description: yt.args.title,
                    image: yt.args.thumbnail_url,
                    service: 'youtube'
                }

                cb(metadata);
            }
            catch(e) {
                // return reply(Boom.badData('Youtube, did not parse correctly for whatever reason.', { error: e }));
            }
            
        }
        else {
            // return reply(Boom.badData('Youtube, No payload or an error occured.', { error: err }));
        }
    });
};