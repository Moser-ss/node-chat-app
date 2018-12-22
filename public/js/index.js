const socket = io();
socket.on('connect', function () {
    console.log('Conneted to server');


});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
})


socket.on('newMessage', function (message) {
    console.log('New Message:', message);
    const { from , text} = message
    const li = jQuery('<li></li>');
    li.text(`${from}: ${text}`)

    jQuery('#messages').append(li)
});

jQuery('#message-form').on('submit', function(event){
    event.preventDefault()

    socket.emit('createMessage', {
        from: 'User',
        text:jQuery('[name=message]').val()
    }, function () {
        
    });
})