const socket = io();
socket.on('connect', function () {
    console.log('Conneted to server');


});
socket.on('disconnect', function () {
    console.log('Disconnected from server');
})
socket.on('newMessage', function (message) {
    message.createAt = moment(message.createAt).format('HH:mm')
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template,message);
    jQuery('#messages').append(html);
});

socket.on('newLocationMessage', function (message){
    message.createAt = moment(message.createAt).format('HH:mm');
    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template,message)
    jQuery('#messages').append(html)
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