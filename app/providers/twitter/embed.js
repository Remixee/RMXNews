class TwitterEmbed {

    constructor(url) {
        url = url.replace(/mobile./g, "");

        this.markup = this.template(url);
    }
    template(url) {
        return `<blockquote class="twitter-tweet" data-lang="en"><a href=${url}></a></blockquote>`;
    }
    loadHelperScript() {
        if (!document.getElementById('embedHelper-twitter')) {
            var s = document.createElement("script");
            s.id = "embedHelper-twitter"
            s.defer = true;
            s.async = true;
            s.type = "text/javascript";
            s.src = "https://platform.twitter.com/widgets.js";
            document.body.appendChild(s);
        }
        else {
            twttr.widgets.load();
        }
    }

}

module.exports = TwitterEmbed;