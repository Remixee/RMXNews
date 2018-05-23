const app = require("../initSpectron")();
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
chai.should();
chai.use(chaiAsPromised);

describe('Vimeo -->', function () {
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
            .setValue('#urlInput', 'https://vimeo.com/channels/staffpicks/264411517')
            .keys("Enter")
            .waitForExist('#metadata')
            .getText('#metadata .title').should.eventually.equal('ECHO OF THE WILD IN VIMEO STAFF PICKS');
    })
})