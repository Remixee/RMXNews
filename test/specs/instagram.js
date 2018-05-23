const app = require("../initSpectron")();
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe('Instagram -->', function () {
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
            .setValue('#urlInput', 'https://www.instagram.com/p/BjF1InlBK8b/?taken-by=instagram')
            .keys("Enter")
            .waitForExist('#metadata', 20000)
            .getText('#metadata .title').should.eventually.equal('FARMER0929');
    })

    it('queries photo metadata', function () {
        return app.client
            .waitForExist('#urlForm')
            .setValue('#urlInput', 'https://www.instagram.com/p/BiN2m6Bj-F2/?taken-by=instagram')
            .keys("Enter")
            .waitForExist('#metadata')
            .waitForExist('#metadata', 20000)
            .getText('#metadata .title').should.eventually.equal('INSTAGRAM');
    })
})



