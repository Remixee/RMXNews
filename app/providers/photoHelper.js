const positions = {
    topRight: {
        x: (w, tw) => { return w - tw - 5 },
        y: () => { return 30 }
    },
    bottomRight: {
        x: (w, tw) => { return w - tw - 5 },
        y: (h, th) => { return h - th}
    },
    topLeft: {
        x: () => { return 5 },
        y: () => { return 30 }
    },
    bottomLeft: {
        x: () => { return 5 },
        y: (h, th) => { return h - th}
    }
}

module.exports = () => {
    global.eventHandler.emit('statusbar:show');
    global.eventHandler.emit('statusbar:update', 'Processing Photo');

    let position = '';
    let watermark = '';
    let image = {};
    let target = {};

    if (event.target.dataset.position) {
        target = event.target;
    }
    else if (event.target.parentNode.dataset.position) {
        target = event.target.parentNode;
    }
    else if (event.target.parentNode.parentNode.dataset.position) {
        target = event.target.parentNode.parentNode;
    }
    else {
        console.log('Failed to find watermark position');
        return;
    }

    position = target.dataset.position;
    image = target.querySelector('img');
    watermark = target.querySelector('watermark').textContent;

    let overlay = (target.querySelector('.snapchatOverlay')) ? target.querySelector('.snapchatOverlay').src : '';
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    var img = new Image();
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
        context.font = 'bold 8pt Helvetica';
        let tw = context.measureText(watermark).width + 12;

        if (overlay) {
            var overImage = new Image();
            overImage.onload = function () {
                context.drawImage(overImage, 0, 0, overImage.width, overImage.height, 0, 0, canvas.width, canvas.height);
                finishProcessing(canvas, context, watermark, position, img, tw);
            }
            overImage.src = overlay;
        }
        else {
            finishProcessing(canvas, context, watermark, position, img, tw);
        }
        
    }
    img.src = image.src;


}

function finishProcessing(canvas, context, watermark, position, img, tw) {
    context.globalAlpha = 0.4;
    context.fillStyle = 'black';
    context.fillRect(positions[position].x(img.width, tw) - 4, positions[position].y(img.height, 16) - 20, tw, 24);

    context.globalAlpha = 1.0;
    context.fillStyle = 'white';
    context.fillText(watermark, positions[position].x(img.width, tw), positions[position].y(img.height, 16) - 4);

    let imageToSave = canvas.toDataURL();
    global.eventHandler.emit('photoPreview:savePhoto', imageToSave);
}