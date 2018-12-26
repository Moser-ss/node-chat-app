require('./config/config.js');
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const { isRealString } = require('./utils/validation.js');
const {Users} = require('./utils/users.js');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT;
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (pararms, callback) => {
        const {name, room } = pararms;

        if (!isRealString(name) || !isRealString(room)) {
            return callback('Name and Room required');
        }
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room );

        io.to(room).emit('updateUserList',users.getUserNameList(room));

        socket.emit('newMessage', generateMessage('System','Welcome to the chat app'));
        socket.broadcast.to(room).emit('newMessage', generateMessage('System',`${name} has joined chat.`));
        callback();
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        const {name, room } = user;
        if (user) {
            io.to(room).emit('updateUserList',users.getUserNameList(room));
            io.to(room).emit('newMessage', generateMessage('System', `${name} has left chat.`));
        }
    });

    socket.on('createMessage', (message, callback) => {
        console.log('New Message Created', message);
        const {from , text} = message;
        io.emit('newMessage', generateMessage(from,text));
        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) => {
        const { latitude, longitude } = coords;
        io.emit('newLocationMessage',generateLocationMessage('System', latitude, longitude));
    });

});
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});