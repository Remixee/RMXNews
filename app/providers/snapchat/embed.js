class SnapchatEmbed {
    constructor(url) {
        this.markup = this.template(url);
    }
    loadHelperScript(){}
    template(url) {
        return `<webview style="min-width: 640px; min-height: 480px;" frameborder="0" src="${url}"></webview>`
    }
}

module.exports = SnapchatEmbed;