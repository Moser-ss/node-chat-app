const socket = io();
socket.on('connect', function () {
    console.log('Conneted to server');


});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
})


socket.on('newMessage', function (message) {
    console.log('New Message:', message);

});