const expect = require('chai').expect;
const { generateMessage , generateLocationMessage}= require('../../server/utils/message.js');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        const from = 'Cool Bro';
        const text = 'I love Burgers';
        const message = generateMessage(from, text);
        expect(message).to.include({
            from,
            text
        });
        expect(message.createAt).to.be.an('number');
    });
});

describe('generateLocationMessage', () => {
    it('should generate the correct location object', () => {
        const googleEndpoint = 'https://www.google.com/maps?q=';
        const latitude = -48.53997;
        const longitude = -63.60848;
        const from = 'system';
        const message = generateLocationMessage(from,latitude, longitude);
        expect(message.from).to.be.equal(from);
        expect(message.createAt).to.be.an('number');
        expect(message.url).to.include(latitude);
        expect(message.url).to.include(longitude);
        expect(message.url).to.include(googleEndpoint);

    });
});