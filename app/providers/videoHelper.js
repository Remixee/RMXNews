module.exports = (event) => {
    let position = '';
    if (event.target.dataset.position) {
        position = event.target.dataset.position;
    }
    else if (event.target.parentNode.dataset.position) {
        position = event.target.parentNode.dataset.position;
    }
    else if (event.target.parentNode.parentNode.dataset.position) {
        position = event.target.parentNode.parentNode.dataset.position
    }
    else {
        console.log('Failed to find watermark position');
        return;
    }

    global.eventHandler.emit('videoPreview:saveVideo', position);
    global.eventHandler.emit('videoPreview:toggle');
}