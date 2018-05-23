const fs = require('fs');
const path = require('path');
const app = require("../initSpectron")();
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe('Facebook -->', function () {
    this.timeout(10000);

    beforeEach(function () {
        chaiAsPromised.transferPromiseness = app.transferPromiseness;
        return app.start();
    });

    afterEach(function () {
        if (app && app.isRunning()) {
            return app.stop();
        }
    });

    it('queries photo metadata', function () {
        return app.client
            .waitForVisible('#urlInput')
            .setValue('#urlInput', 'https://www.facebook.com/NFL/photos/a.131239636262.116181.68680511262/10155941605561263/')
            .keys("Enter")
            .waitForExist('#metadata')
            .getText('#metadata .title').should.eventually.equal('NFL');
    })


    it('queries video metadata', function () {
        return app.client
            .waitForVisible('#urlInput')
            .setValue('#urlInput', 'https://www.facebook.com/oldskoolrecipes/videos/1827956683944293/')
            .keys("Enter")
            .waitForExist('#metadata')
            .getText('#metadata .title').should.eventually.equal('OLD SKOOL RECIPES');
    })

    /* it('downloads a video with the watermark in the top left', function () {
        return app.client.waitForExist('#urlForm')
            .setValue('#urlInput', 'https://www.facebook.com/NHL/videos/10155363346857466/')
            .keys("Enter")
            .waitForExist('#metadata')
            .setValue('#assetName', 'fb_test')
            // .setValue('#saveDirectory', path.join(__dirname, '../tmp'))
            .click('#downloadUrl')
            .waitForVisible('#savePreviews')
            .click('#facebookVideoPreview > li:nth-child(1)')
            .waitForValue('', 20000, )
        //wait for download to finish
        //check file exists
    });

    it('downloads a photo with the watermark in the bottom right', function () {
        //query photo
        //wait for download to finish
        //check file exists
    }) */
})



