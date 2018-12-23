require('./config/config.js');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);

const {generateMessage, generateLocationMessage} = require('./utils/message.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT

app.use(express.static(publicPath));
app.use((req, res, next) => {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to apped to server.log');
        }
    })
    next();
})

app.get('/', (request, response) => {
    response.render(publicPath)
})

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('System','Welcome to the chat app'));

    socket.broadcast.emit('newMessage', generateMessage('System','New user joined chat'));

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })

    socket.on('createMessage', (message, callback) => {
        console.log('New Message Created', message);
        const {from , text} = message
        io.emit('newMessage', generateMessage(from,text))
        callback('This is from the server');
    })

    socket.on('createLocationMessage', (coords) => {
        const { latitude, longitude } = coords
        io.emit('newLocationMessage',generateLocationMessage('System', latitude, longitude))
    })
})
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})