const generateMessage = (from, text) => ({
        from,
        text,
        createAt: Date.now()
    });

    module.exports = {
        generateMessage
    };