const generateMessage = (from, text) => ({
    from,
    text,
    createAt: Date.now()
});

const generateLocationMessage = (from, latitude, longitude) => ({
    from,
    url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    createAt: Date.now()
});

module.exports = {
    generateMessage,
    generateLocationMessage
};