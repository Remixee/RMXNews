const app = require("../initSpectron")();
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe('Twitter -->', function () {
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
            .setValue('#urlInput', 'https://twitter.com/kanyewest/status/991092016195911680')
            .keys("Enter")
            .waitForExist('#metadata')
            .getText('#metadata .title').should.eventually.equal('KANYE WEST ON TWITTER');
    })

    it('queries photo metadata', function () {
        return app.client
            .waitForExist('#urlForm')
            .setValue('#urlInput', 'https://twitter.com/RockingThePixel/status/991126674770194433')
            .keys("Enter")
            .waitForExist('#metadata')
            .getText('#metadata .title').should.eventually.equal('MARCUS CONGE 🌳 ON TWITTER');
    })
})