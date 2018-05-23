const path = require('path');
const Application = require('spectron').Application
const electronPath = require('electron')

module.exports = () => {
    // const electronPath = path.join(__dirname, "../dist/mac/rmxnews.app/Contents/MacOS/rmxnews");
    const appPath = path.join(__dirname, '../');

    return new Application({
        path: electronPath,
        args: [ appPath ],
        env: {
            ELECTRON_ENABLE_LOGGING: true,
            ELECTRON_ENABLE_STACK_DUMPING: true,
            NODE_ENV: "staging",
            TESTING: true
        },
        startTimeout: 20000,
        chromeDriverLogPath: '../chromedriverlog.txt'
    });
}