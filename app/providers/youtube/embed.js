class YoutubeEmbed {

    constructor(url) {
        if (url.indexOf("watch?v=") < 0) {
            this.markup = '';
            return;
        }

        url = url.replace("watch?v=", "v/");
        this.markup = this.template(url);
    }
    loadHelperScript() {}
    template(url){
        return `<iframe class="youtubeFrame" src=${url.replace("/v/", "/embed/") + "?showinfo=0"} frameborder="0" allowfullscreen style="min-width: 640px; min-height: 480px;"/>`;
    }
}

module.exports = YoutubeEmbed;