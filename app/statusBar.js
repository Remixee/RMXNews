const EventEmitter = require('events').EventEmitter;

class StatusBar extends EventEmitter {
    constructor() {
        super();
        this.el = document.getElementById('statusBar');

        this.on('statusbar:update', this.update.bind(this));
        this.on('statusbar:show', this.show.bind(this));
        this.on('statusbar:hide', this.hide.bind(this));
    }
    show() {
        this.el.style.display = 'block';
    }
    hide() {
        this.el.style.display = 'none';
    }
    update(data) {
        this.el.innerHTML = `${data}`;
    }
}

module.exports = StatusBar;