const expect = require('chai').expect;
const { isRealString } = require('../../server/utils/validation');

describe('isRealString', () => {

    it('should reject non-string values', () => {
        const values = [ {}, 23232, []];
        values.forEach( value => {
            expect(isRealString(value)).to.be.false;
        });
    });

    it('should reject string with only spaces', () => {
        const values = ['    ', '           ', '        '];
        values.forEach(value => {
            expect(isRealString(value)).to.be.false;
        });
    });

    it('should allow string  with no-space', () => {
        const values = [ 'lol', 'foo bar', ' foo bar '];
        values.forEach(value => {
            expect(isRealString(value)).to.be.true;
        });
    });
});