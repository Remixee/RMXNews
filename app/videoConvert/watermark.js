const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffStatic = require('ffmpeg-static');

function fixPathForAsarUnpack(path) { 
    let isElectron = 'electron' in process.versions;
    let isUsingAsar = isElectron && process.mainModule && process.mainModule.filename.includes('app.asar');

    if(isUsingAsar) {
        return path.replace('app.asar', 'app.asar.unpacked')
    } else {
        return path;
    }
}

ffmpeg.setFfmpegPath(fixPathForAsarUnpack(ffStatic.path));
console.log(fixPathForAsarUnpack(ffStatic.path));

const platform = require('platform');
let fontPath = '';

const osFamily = platform.os.family;
const fontFiles = {
    osx: '/System/Library/Fonts/avenir.ttc',
    linux: path.join(__dirname, '../assets/fonts/HelveticaNeue.ttf'),
    windows: '/Windows/Fonts/arial.ttf'
}

if (osFamily.indexOf('OS X') > -1) {
    fontPath = fontFiles['osx'];
}
else if (osFamily.indexOf('Windows') > -1) {
    fontPath = fontFiles['windows'];
}
else if (osFamily.indexOf('Linux') > -1) {
    fontPath = fontFiles['linux'];
}
else {
    console.log('No font found: ', osFamily);
}

const positions = {
    topRight: {
        x: 'w-tw-10',
        y: '10'
    },
    bottomRight: {
        x: 'w-tw-10',
        y: 'h-th-10'
    },
    topLeft: {
        x: '10',
        y: '10'
    },
    bottomLeft: {
        x: '10',
        y: 'h-th-10'
    }
}

class Watermark {
    constructor(videoPath, watermarkText, metadata) {
        let filename = path.basename(videoPath);
        let baseDir = path.dirname(videoPath);
        let command = ffmpeg(videoPath);

        let title = metadata.title;       
        
        if (title.indexOf('on Twitter')) {
            title = title.replace(' on Twitter', '');
        }
        else if (title.indexOf('on Twitch')) {
            title = title.replace(' on Twitch', '');
        }

        let watermarkString = title + '/' + metadata.service.charAt(0).toUpperCase();

        if (metadata.overlay) {
            command.input(metadata.overlay)
                .complexFilter([
                    'scale2ref[b][a];[b][a]overlay[b]',
                    '[b]drawtext=box=1:boxcolor=black@0.4:boxborderw=10:fontfile=' +
                    fontPath +
                    ':text=\'' + watermarkString + metadata.service.slice(1) + '\'' +
                    ':fontsize=32:fontcolor=white:x=' + positions[watermarkText].x + ':y=' + positions[watermarkText].y
                ])
        }
        else {
            command
            .videoFilters({
                filter: 'drawtext',
                options: {
                    box: 1,
                    boxcolor: 'black@0.4',
                    boxborderw: 4,
                    fontfile: fontPath,
                    text: watermarkString + metadata.service.slice(1),
                    fontsize: 16,
                    fontcolor: 'white',
                    x: positions[watermarkText].x,
                    y: positions[watermarkText].y
                }
            })
        }

        command.on('start', function (commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('progress', function (progress) {
            if(progress.percent) {
                global.eventHandler.emit('statusbar:update', 'Processing ... ' + Math.floor(progress.percent) + '%');
            }
            else {
                global.eventHandler.emit('statusbar:update', 'Processing ... ');
            }
        })
        .on('error', function (err, stdout, stderr) {
            console.log('An error occurred: ' + err.message);
            global.eventHandler.emit('statusbar:update', 'Something went wrong processing video. Try again or contact support@remixee.com with the failed video link.');
            setTimeout(() => { global.eventHandler.emit('statusbar:hide'); }, 3000);
        })
        .on('end', function () {                
            fs.unlinkSync(videoPath);
            fs.rename(baseDir + '/convert_' + filename, videoPath, (err) => {
                if (err) console.log('ERROR: ' + err);

                global.eventHandler.emit('statusbar:update', 'Processing complete. Saved: ' + videoPath);
                setTimeout(() => { global.eventHandler.emit('statusbar:hide'); }, 3000);
            });
            
            console.log('Processing finished!');
        })
    
        command.save(baseDir + '/convert_' + filename);
            
    }
}

module.exports = Watermark;

