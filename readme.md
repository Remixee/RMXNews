# RMXNews

## What?
RMXNews is a free open source tool for journalists and news organizations, allowing them to create decentralized news reports with greater detail and collaboration.

### TODO
- Add download tests
- Sign Windows build
- Fix Linux build

## Feature Ideas

### Photo of Facebook, Twitter status
- Figure out how to show embed of status
- Worst case try doing THREE with iframe texture. Try in THREE and then port to Electron.

### Cancel during processing or download
- Refresh app
- Add cancel button to status bar downloads
- Button kills ffmpeg, youtube-dl
- Clean up files created (convert, regular)

### Recently downloaded
- Add bar on the bottom 
- Keep track of file locations downloaded in session
- Files show preview of first movie frame? or photo
- Clicking files takes you to their finder location


## Tests
Using Spection and WebDriverIO for testing.

## Useful commands 

codesign --deep --force --verbose --sign "Developer ID Application: RMX Media Inc. (XXXXXXXXXX)" node_modules/electron-prebuilt-compile/node_modules/electron/dist/Electron.app