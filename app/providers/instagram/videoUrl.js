/**
 * Instagram URL
 */
const Wreck = require('wreck');

module.exports = (url, cb) => {
    Wreck.get(url, {}, (err, res, payload) => {
        if (res.statusCode == 404) {
            console.log('Instagram, video data not found', { url: url });
        }
        else if (res.statusCode != 200) {
            console.log('Instagram, did not return correctly for whatever reason.');
        }

        if (payload) {
            try {
                let htmlOut = payload.toString();
                let igPostData = htmlOut.match(/window._sharedData = (.*);/)[1];
                let post = JSON.parse(igPostData);
                let postDetails = post.entry_data.PostPage[0].graphql;
                
                if (postDetails && postDetails.shortcode_media.video_url) {
                    cb(url);
                }
                else {
                    cb();
                }
            }
            catch (e) {
                console.log('Instagram, did not parse correctly for whatever reason.', { error: e })
            }
        }
        else {
            console.log('Instagram, No payload or an error occured.', { error: err });
        }
    });
}

