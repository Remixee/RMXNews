const videoHelper = require('../videoHelper');
const video = {
    preview(metadata) {
        let videoPreviewTemplate = () => {
            return `
                <ul>
                    <li data-position='topLeft'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <img class="snapchatOverlay" src="${metadata.overlay}" onerror="this.style.display='none';"/>
                            <watermark class='topLeft'>${metadata.title}/${metadata.service}</watermark>
                        </div>
                        <p>Watermark Top Left</p>
                    </li>
                    <li data-position='topRight'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <img class="snapchatOverlay" src="${metadata.overlay}" onerror="this.style.display='none';"/>
                            <watermark class='topRight'>${metadata.title}/${metadata.service}</watermark>
                        </div>
                        <p>Watermark Top Right</p>
                    </li>
                    <li data-position='bottomLeft'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <img class="snapchatOverlay" src="${metadata.overlay}" onerror="this.style.display='none';"/>
                            <watermark class='bottomLeft'>${metadata.title}/${metadata.service}</watermark>
                        </div>
                        <p>Watermark Bottom Left</p>
                    </li>
                    <li data-position='bottomRight'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <img class="snapchatOverlay" src="${metadata.overlay}" onerror="this.style.display='none';"/>
                            <watermark class='bottomRight'>${metadata.title}/${metadata.service}</watermark>
                        </div>
                        <p>Watermark Bottom Right</p>
                    </li>
                </ul>
            `}

        let savePreviews = document.getElementById('savePreviews');
        savePreviews.innerHTML = videoPreviewTemplate(metadata);
        savePreviews.style.display = 'block';
        savePreviews.querySelectorAll('li').forEach((videoPreview) => {
            videoPreview.onclick = videoHelper;
        });
    }
}

module.exports = video;