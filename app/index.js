const fs = require('fs');
const path = require('path');
const youtubedl = require('youtube-dl');
const { dialog } = require('electron').remote;
const VideoWatermark = require('./videoConvert/watermark');
const StatusBar = require('./statusBar');
const Store = require('electron-store');
const postAjax = require('./util/ajaxPost');
const config = require('./config/index');

const providers = {
    facebook: require('./providers/facebook'),
    instagram: require('./providers/instagram'),
    snapchat: require('./providers/snapchat'),
    twitter: require('./providers/twitter'),
    twitch: require('./providers/twitch'),
    vimeo: require('./providers/vimeo'),
    youtube: require('./providers/youtube')
}

const urlsSupported = [
    "instagram",
    "facebook",
    "snapchat",
    "twitter",
    "youtube",
    "vimeo",
    "twitch"
];

global.eventHandler = new StatusBar();

class RMXNews {
    constructor() {
        console.log("--- Starting RMX News ---");
        
        //Main Form
        let urlForm = document.getElementById('urlForm');
        urlForm.onsubmit = this.loadUrl.bind(this);
        urlForm.onpaste = this.pasteUrl.bind(this);

        //Elements
        this.urlInput = document.getElementById('urlInput');
        this.statusBar = document.getElementById('statusBar');
        this.chooseDirectory = document.getElementById('chooseDirectory');
        this.saveDirectory = document.getElementById('saveDirectory');
        this.assetName = document.getElementById('assetName');
        this.previewUrl = document.getElementById('previewUrl');
        this.embedPreview = document.getElementById('embedPreview');
        this.loadingBar = document.getElementById('loadingBar');
        this.downloadUrlEl = document.getElementById('downloadUrl');
        this.capturePhoto = document.getElementById('capturePhoto');

        //UI events
        this.chooseDirectory.onclick = this.showDialog.bind(this);
        this.saveDirectory.onclick = this.showDialog.bind(this);
        this.previewUrl.onclick = this.loadUrl.bind(this);        
        this.downloadUrlEl.onclick = this.setupVideoPreview.bind(this);        
        this.capturePhoto.onclick = this.setupPhotoPreview.bind(this);

        //Global app events
        global.eventHandler.on('videoPreview:saveVideo', this.downloadUrl.bind(this))
        global.eventHandler.on('videoPreview:toggle', this.setupVideoPreview.bind(this))
        global.eventHandler.on('photoPreview:savePhoto', this.savePhoto.bind(this))

        //Defaults
        this.store = new Store();
        
        if(this.store.has('user-directory')) {
            let activeDirectory = this.store.get('user-directory');
            this.saveDirectory.innerHTML = activeDirectory;
            this.directoryPath = activeDirectory;
        }
    }
    
    pasteUrl(event) {
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        if (paste) {
            this.urlInput.value = paste;
        }
        this.loadUrl(event);
    }
    loadUrl(event) {
        event.preventDefault();
        
        let url = this.urlInput.value;
        let provider = this.setupUrlProvider(url);
        if (!provider) {
            alert('Url not supported');
            return;
        }

        let embed = new providers[provider].embed(url);     
        this.loadingBar.style.display = 'block';
        if(embed.markup != '') {
            embedPreview.innerHTML = embed.markup;    
        }
        else {
            this.loadingBar.style.display = 'none';
            alert('Invalid Url');
            return;
        }
        
        embed.loadHelperScript();
        this.loadMetadata(url, provider);
        this.setupToolbar(url, provider);
    }
    setupToolbar(url, providerName) {
        providers[providerName].videoUrl(url, (videoUrl) => {
            //- If video add video and photo options
            if(videoUrl) {
                this.downloadUrlEl.style.display = 'inline-block';
                this.capturePhoto.style.display = 'inline-block';
            }
            else
            {
                this.downloadUrlEl.style.display = 'none';
                this.capturePhoto.style.display = 'inline-block';
            }
        });
    }
    setupPhotoPreview() {
        if (!this.metadata) {
            alert('No metadata found. Add a url.');
            return;
        }

        if (this.previewOpen){
            this.previewOpen = false;
            document.getElementById('savePreviews').style.display = 'none';
            this.capturePhoto.querySelector('img').src = "assets/img/photo-camera-vintage.png"
            this.downloadUrlEl.querySelector('img').src = "assets/img/download-video-file.png"
        }
        else {
            let url = this.urlInput.value;
            let providerName = this.setupUrlProvider(url);
            providers[providerName].photo.preview(this.metadata);
            this.previewOpen = true;
            this.capturePhoto.querySelector('img').src = "assets/img/close.png"
        }
    }
    setupVideoPreview() {
        if (!this.metadata) {
            alert('No metadata found. Add a url.');
            return;
        }

        if (this.previewOpen) {
            this.previewOpen = false;
            document.getElementById('savePreviews').style.display = 'none';
            this.capturePhoto.querySelector('img').src = "assets/img/photo-camera-vintage.png"
            this.downloadUrlEl.querySelector('img').src = "assets/img/download-video-file.png"
        }
        else {
            let url = this.urlInput.value;
            let providerName = this.setupUrlProvider(url);
            providers[providerName].video.preview(this.metadata);
            this.previewOpen = true;
            this.downloadUrlEl.querySelector('img').src = "assets/img/close.png"
        }
    }
    loadMetadata(url, provider) {
        let metadataTemplate = function(metadata){ return `
            <div id="metadata" class="${metadata.service}">
                <h1 class="title">${metadata.title}</h1>
                <p class="description">${metadata.description}</p>
                <img src="${metadata.image}"/>
                <p class="service">${metadata.service}</p>
            </div>
        `};

        providers[provider].metadata(url, (metadata) => {
            if(!metadata || !metadata.image) {
                embedPreview.innerHTML = "";
                document.getElementById('metadataPreview').innerHTML = "";
                alert('No public metadata found.');
                this.loadingBar.style.display = 'none';
                return;
            }

            this.metadata = metadata;
            document.getElementById('metadataPreview').innerHTML = metadataTemplate(metadata);
            this.loadingBar.style.display = 'none';
        });
    }
    downloadUrl(watermarkPosition) {
        if(!this.directoryPath) {
            alert('Choose a directory to save the file to.');
            return;
        }
        if (this.assetName.value.length < 1) {
            alert('Enter a name.');
            return;
        }

        this.submitUrl(this.urlInput.value, this.directoryPath, watermarkPosition)
    }
    showDialog(event) {
        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory', 'createDirectory'],
            message: 'Choose Save Directory Destination:'
        }, 
        (filePaths) => {
            if(filePaths) {
                this.directoryPath = filePaths[0];
                this.store.set('user-directory', this.directoryPath);
                this.saveDirectory.innerHTML = this.directoryPath;
            }
        });
    }
    setupUrlProvider(url) {
        let videoServer = "";

        for (let z = 0; z < urlsSupported.length; z++) {
            if (url.indexOf(urlsSupported[z]) !== -1) {
                videoServer = urlsSupported[z];
            }
        }

        if(!videoServer) {
            console.log("ERROR -- Incompatible URL.");
        }

        return videoServer;
    }
    submitUrl(url, savePath, watermarkPosition) {
        global.eventHandler.emit('statusbar:show');
        global.eventHandler.emit('statusbar:update', 'Getting video ... ');

        let providerName = this.setupUrlProvider(url);
        providers[providerName].videoUrl(url, (videoUrl) => {
            let video = youtubedl(videoUrl);
            let assetPath = path.join(savePath, this.assetName.value + '.mp4');
            let size = 0;

            video.on('info', function (info) {
                size = info.size;
                console.log('Save started');
                console.log('filename: ' + info.filename);
                console.log('size: ' + info.size);
            });

            let pos = 0;
            video.on('data', function (chunk) {
                pos += chunk.length;
                // `size` should not be 0 here.
                if (size) {
                    var percent = (pos / size * 100).toFixed(2);
                    // process.stdout.cursorTo(0);
                    // process.stdout.clearLine(1);
                    global.eventHandler.emit('statusbar:update', 'Saving ... ' + percent + '%');
                }
            })

            video.on('end', () => {
                console.log('Finished saving!');
                new VideoWatermark(assetPath, watermarkPosition, this.metadata);
            })

            let videoDownload = fs.createWriteStream(assetPath);
            video.pipe(videoDownload);
        });        
    }
    savePhoto(photoData) {
        if (this.assetName.value.length < 1) {
            alert('Enter a name.');
            global.eventHandler.emit('statusbar:hide');
            return;
        }

        let assetPath = path.join(this.directoryPath, this.assetName.value + '.png');
        let data = photoData.replace(/^data:image\/\w+;base64,/, "");
        let buf = new Buffer(data, 'base64');
        fs.writeFileSync(assetPath, buf);
        global.eventHandler.emit('statusbar:update', 'Photo Saved: ' + assetPath);
        setTimeout(() => { global.eventHandler.emit('statusbar:hide'); }, 3000);
        this.setupPhotoPreview();
    }
}

let RMX = new RMXNews();