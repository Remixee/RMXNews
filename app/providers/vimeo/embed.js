class VimeoEmbed{
    constructor(url) {
        this.markup = this.template(url);
    }
    template(url) {
        // https://player.vimeo.com/video/264411517
        return `<webview src=${url} frameborder="0" allowfullscreen style="min-height: 800px"/>`
    }
    loadHelperScript(){
        if (!document.getElementById('embedHelper-vimeo')) {
            var s = document.createElement("script");
            s.id = "embedHelper-vimeo"
            s.type = "text/javascript";
            s.src = "https://player.vimeo.com/api/player.js";
            document.body.appendChild(s);
        }
    }
}

module.exports = VimeoEmbed;