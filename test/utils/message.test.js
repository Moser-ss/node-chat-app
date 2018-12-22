const expect = require('chai').expect;
const { generateMessage }= require('../../server/utils/message.js');

describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        const from = 'Cool Bro';
        const text = 'I love Burgers';
        const message = generateMessage(from, text);
        expect(message).to.include({
            from,
            text
        })
        expect(message.createAt).to.be.an('number')
    })
})