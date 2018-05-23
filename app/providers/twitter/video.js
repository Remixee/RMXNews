const videoHelper = require('../videoHelper');
const video = {
    preview(metadata) {
        let videoPreviewTemplate = () => {
            let title = metadata.title;

            if (title.indexOf('on Twitter')) {
                title = title.replace(' on Twitter', '');
            }

            let watermarkString = title + '/' + metadata.service.charAt(0).toUpperCase();
            return `
                <ul>
                    <li data-position='topLeft'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <watermark class='topLeft'>${watermarkString}</watermark>
                        </div>
                        <p>Watermark Top Left</p>
                    </li>
                    <li data-position='topRight'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <watermark class='topRight'>${watermarkString}</watermark>
                        </div>
                        <p>Watermark Top Right</p>
                    </li>
                    <li data-position='bottomLeft'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <watermark class='bottomLeft'>${watermarkString}</watermark>
                        </div>
                        <p>Watermark Bottom Left</p>
                    </li>
                    <li data-position='bottomRight'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <watermark class='bottomRight'>${watermarkString}</watermark>
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