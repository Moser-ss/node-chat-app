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

socket.on('newLocationMessage', function (message){
    const { from , url} = message
    const li = jQuery('<li></li>')
    const a = jQuery('<a target="_blank">My current location</a>')

    li.text(`${from}: `);
    a.attr('href',url);
    li.append(a)

    jQuery('#messages').append(li)
})
jQuery('#message-form').on('submit', function(event){
    event.preventDefault()
    const messageTextBox = jQuery('[name=message]')
    socket.emit('createMessage', {
        from: 'User',
        text:messageTextBox.val()
    }, function () {
        messageTextBox.val('')
    });
})

const locationButton = jQuery('#send-location');
locationButton.on('click', function (event) {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.')
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (postion) {
        locationButton.removeAttr('disabled').text('Send Location')
        const { latitude, longitude } = postion.coords
        socket.emit('createLocationMessage',{
            latitude,
            longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location')
        console.log('Unable to fecth location');
        alert('Unable to fecth location')
    })
})