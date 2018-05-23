const { app, BrowserWindow, dialog, Menu } = require('electron');
const log = require('electron-log');
const path = require('path');
const url = require('url');
const autoUpdater = require('electron-updater').autoUpdater
const WindowStateManager = require('electron-window-state-manager');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

const mainWindowState = new WindowStateManager('mainWindow', {
    defaultWidth: 1100,
    defaultHeight: 1016
});

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let template = [];
if(process.platform == 'darwin') {
    template.push({
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function () { app.quit(); } }
        ]
    });
}
else {
    template.push({
        label: "Application",
        submenu: [
            { label: "About Application", click: function() {
                dialog.showMessageBox({
                    type: 'info',
                    buttons: ['OK'],
                    message: 'About RMXNews',
                    cancelId: 1,
                    detail: 'RMXNews v' + app.getVersion()
                })
            } },
            { type: "separator" },
            { label: "Quit", accelerator: "Command+Q", click: function () { app.quit(); } }
        ]
    })
}

template.push({
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]
});

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    // Create the Menu
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Create the browser window.
    win = new BrowserWindow({
        width: mainWindowState.width,
        height: mainWindowState.height,
        x: mainWindowState.x,
        y: mainWindowState.y,
        minWidth: 1024,
        minHeight: 768,
        backgroundColor: '#222222',
        icon: __dirname + '../build/icon',
        show: false
    })

    if (mainWindowState.maximized) {
        win.maximize();
    }

    win.on('ready-to-show', function () {
        win.show();
        win.focus();
    });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../app/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    autoUpdater.checkForUpdates();

    // Open the DevTools.
    if(!process.env.TESTING && process.env.NODE_ENV == 'develop') {
        win.webContents.openDevTools()
    }

    // Emitted when the window is closed.
    win.on('close', () => {
        mainWindowState.saveState(win);
    })
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.        
        win = null
    })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});