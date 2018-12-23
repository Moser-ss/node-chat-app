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

    socket.emit('createMessage', {
        from: 'User',
        text:jQuery('[name=message]').val()
    }, function () {
        
    });
})

const locationButton = jQuery('#send-location');
locationButton.on('click', function (event) {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.')
    }

    navigator.geolocation.getCurrentPosition(function (postion) {
        const { latitude, longitude } = postion.coords
        socket.emit('createLocationMessage',{
            latitude,
            longitude
        })
    }, function () {
        console.log('Unable to fecth location');
        alert('Unable to fecth location')
    })
})