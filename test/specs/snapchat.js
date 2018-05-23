const app = require("../initSpectron")();
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe('Snapchat -->', function () {
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

    it('queries video metadata', function () {
        return app.client
            .waitForExist('#urlForm')
            .setValue('#urlInput', 'https://story.snapchat.com/s/m:W7_EDlXWTBiXAEEniNoMPwAAYHSt_GEbLDmCTAWMZM9lvAWMZM9fDAHanAA/')
            .keys("Enter")
            .waitForExist('#metadata')
            .getText('#metadata .title').should.eventually.equal('SAN FRANCISCO, CALIFORNIA');
    })
})