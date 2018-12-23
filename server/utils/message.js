const moment = require('moment');
const generateMessage = (from, text) => ({
    from,
    text,
    createAt: moment().valueOf()
});

const generateLocationMessage = (from, latitude, longitude) => ({
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createAt: moment().valueOf()
});

module.exports = {
    generateMessage,
    generateLocationMessage
};