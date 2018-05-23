class TwitchEmbed {
    constructor(url) {
        let amendedUrl = "";
        let twitchURL = url.split('?')[0];
        let urlSplit = twitchURL.split('/');

        if (url.indexOf("clips") != -1) {
            let streamId = urlSplit[urlSplit.length - 1];
            amendedUrl = "https://clips.twitch.tv/embed?clip=" + streamId + "&autoplay=false&tt_medium=clips_embed";
        }
        else if (url.indexOf("videos") != -1) {
            let videoId = urlSplit[urlSplit.length - 1];
            amendedUrl = "https://player.twitch.tv/?autoplay=false&video=" + videoId;
        }
        else {
            let videoId = urlSplit[urlSplit.length - 1];
            amendedUrl = "https://player.twitch.tv/?channel=" + videoId;
        }

        this.markup = this.template(amendedUrl);
    }
    template(url) {
        return `<iframe src=${url}  width='640' height='360' frameborder='0' scrolling='no' allowfullscreen='true' />`;
    }
    loadHelperScript() {
        return false;
    }
}

module.exports = TwitchEmbed;

//<iframe src="https://clips.twitch.tv/embed?clip=GeniusLitigiousBarracudaAsianGlow&autoplay=false&tt_medium=clips_embed" width="640" height="360" frameborder="0" scrolling="no" allowfullscreen="true"></iframe>
//<iframe src="https://player.twitch.tv/?channel=esports_bar" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe><a href="https://www.twitch.tv/esports_bar?tt_content=text_link&tt_medium=live_embed" style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px; text-decoration:underline;">Watch live video from esports_bar on www.twitch.tv</a>
//<iframe src="https://player.twitch.tv/?autoplay=false&video=v228668187" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe><a href="https://www.twitch.tv/videos/228668187?tt_content=text_link&tt_medium=vod_embed" style="padding:2px 0px 4px; display:block; width:345px; font-weight:normal; font-size:10px; text-decoration:underline;">Watch Gaming on an QLED Display by Samsung! - #sponsored - !monitor from DrLupo on www.twitch.tv</a>