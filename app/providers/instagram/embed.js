class InstagramEmbed {
    constructor(url) {
        this.markup = this.template(url);
    }
    template(url) {
        return `<blockquote data-instgrm-captioned="data-instgrm-captioned" data-instgrm-version="7" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);" class="instagram-media">
                <div style="padding:8px;">
                    <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:26.171875% 0; text-align:center; width:100%;">
                    <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div>
                    </div>
                </div>
                <p style=" margin:8px 0 0 0; padding:0 4px;"><a href=${url} style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank"></a></p>
                </blockquote>`;
    }
    loadHelperScript() {
        if (!document.getElementById('embedHelper-instagram')) {
            var s = document.createElement("script");
            s.id = "embedHelper-instagram"
            s.defer = true;
            s.async = true;
            s.type = "text/javascript";
            s.src = "https://www.instagram.com/embed.js";
            document.body.appendChild(s);
        }
        else {
            instgrm.Embeds.process();
        }
    }

}

module.exports = InstagramEmbed;