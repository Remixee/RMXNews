const photoHelper = require('../photoHelper');

const photo = {
    preview(metadata) {
        let photoPreviewTemplate = () => {
            return `
                <ul>
                    <li data-position='topLeft'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <watermark class='topLeft'>${metadata.title}/${metadata.service}</watermark>
                        </div>
                        <p>Watermark Top Left</p>
                    </li>
                    <li data-position='topRight'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <watermark class='topRight'>${metadata.title}/${metadata.service}</watermark>
                        </div>
                        <p>Watermark Top Right</p>
                    </li>
                    <li data-position='bottomLeft'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <watermark class='bottomLeft'>${metadata.title}/${metadata.service}</watermark>
                        </div>
                        <p>Watermark Bottom Left</p>
                    </li>
                    <li data-position='bottomRight'>
                        <div class="previewContainer">
                            <img src="${metadata.image}"/>
                            <watermark class='bottomRight'>${metadata.title}/${metadata.service}</watermark>
                        </div>
                        <p>Watermark Bottom Right</p>
                    </li>
                </ul>
            `}
        
        metadata.image = metadata.image.replace("/default", "/hqdefault");
        let savePreviews = document.getElementById('savePreviews');
        savePreviews.innerHTML = photoPreviewTemplate(metadata);
        savePreviews.style.display = 'block';
        savePreviews.querySelectorAll('li').forEach((photoPreview) => {
            photoPreview.onclick = photoHelper;
        });
    }
}

module.exports = photo;