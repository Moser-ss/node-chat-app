require('./config/config.js');
const path = require('path');
const fs = require('fs');
const express = require('express');
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server);

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

    socket.emit('newMessage', {
        from: 'System',
        text: 'Welcome to the chat app'
    });
    socket.broadcast.emit('newMessage', {
        from: 'System',
        text: 'New user joined chat'
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    })

    socket.on('createMessage', (message) => {
        console.log('New Message Created', message);
        io.emit('newMessage', {
            ...message,
            createAt: Date.now()
        })
    })
})
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
})