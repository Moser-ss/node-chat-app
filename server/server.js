require('./config/config.js');
const path = require('path');
const express = require('express');
const app = express();
// deepcode ignore HttpToHttps: The service is running behind a HTTPS loadbalancer
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
        let {name, room , listrooms } = pararms;

        if (!isRealString(name) || ( !isRealString(room) && !isRealString(listrooms) ) ) {
            return callback('Name and Room required');
        }
        if (!isRealString(room)) {
            room = listrooms;
        }
        
        const user = users.getUserByName(name);
        if (user) {
            return callback('Name already taken');
        }
        room = room.toLowerCase();
        // deepcode ignore PureMethodReturnValueIgnored: the join function the socket.io has a different behaviour 
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, name, room );

        io.to(room).emit('updateUserList',users.getUserNameList(room));

        socket.emit('newMessage', generateMessage('System','Welcome to the chat app'));
        socket.broadcast.to(room).emit('newMessage', generateMessage('System',`${name} has joined chat.`));

        io.emit('updateRooms',users.getRooms());
        callback();
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);
        if (user) {
            const {name, room } = user;
            io.to(room).emit('updateUserList',users.getUserNameList(room));
            io.to(room).emit('newMessage', generateMessage('System', `${name} has left chat.`));
        }
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);
        const {text} = message;
        if (user && isRealString(text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name,text));   
        }

        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id);
        if(user){
            const { latitude, longitude } = coords;
            io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name, latitude, longitude));
        }
    });

    socket.on('getUpdateRooms',() => {
        io.emit('updateRooms',users.getRooms());
    });

});
server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});