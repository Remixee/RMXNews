class FacebookEmbed {
    constructor(url) {
        this.markup = this.videoTemplate(url);        
    }
    videoTemplate(url){
        return `<div class='fb-video' data-href=${url} data-width=700 data-show-text='false'></div>`;        
    }
    loadWebview(url) {
        let markup = `<webview src="https://www.facebook.com/v2.6/plugins/video.php?${url.nodeValue}" style="display:inline-flex; width:640px; height:640px"></webview>`;
        document.getElementById('embedPreview').innerHTML = markup;
    }
    loadHelperScript() {
        if (!document.getElementById('fb-root')) {
            var s = document.createElement("div");
            s.id = "fb-root"
            document.body.appendChild(s);

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));

            window.fbAsyncInit = () => {
                setTimeout(() => {
                    let iframeCode = document.getElementsByClassName('fb_iframe_widget')[0].attributes['fb-iframe-plugin-query'];
                    this.loadWebview(iframeCode);
                }, 1000);
            }
        }
        
    }
}

module.exports = FacebookEmbed;