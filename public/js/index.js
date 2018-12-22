const socket = io();
socket.on('connect', function () {
    console.log('Conneted to server');


    socket.emit('createMessage', {
        from: 'Super U',
        text: 'Lets super code'
    })
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
})


socket.on('newMessage', function (message) {
    console.log('New Message:', message);

});