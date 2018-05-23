/**
 * Instagram Post Scraper
 */
const Wreck = require('wreck');

module.exports = (url, cb) => {
    Wreck.get(url, {}, (err, res, payload) => {
        if (res.statusCode == 404) {
            return cb();
            // return reply(Boom.notFound('Instagram, video data not found', { url: url }));
        }
        else if (res.statusCode != 200) {
            return cb();
            // return reply(Boom.badRequest('Instagram, did not return correctly for whatever reason.', { status: res.statusCode }));
        }

        if (payload) {
            try {
                let htmlOut = payload.toString();
                let igPostData = htmlOut.match(/window._sharedData = (.*);/)[1];
                let post = JSON.parse(igPostData);
                let postDetails = post.entry_data.PostPage[0].graphql;
                let userName = postDetails.shortcode_media.owner.username;
                let time = postDetails.shortcode_media.taken_at_timestamp;
                let caption = postDetails.shortcode_media.edge_media_to_caption.edges[0].node.text;

                let metadata = {
                    title: userName,
                    description: caption,
                    image: postDetails.shortcode_media.display_url,
                    time: time,
                    service: 'instagram'
                }

                return cb(metadata);
            }
            catch (e) {
                return cb();
                // return reply(Boom.badData('Instagram, did not parse correctly for whatever reason.', { error: e }));
            }
        }
        else {
            return cb();
            // return reply(Boom.badData('Instagram, No payload or an error occured.', { error: err }));
        }
    });
}

