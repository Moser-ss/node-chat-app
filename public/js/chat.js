const socket = io();

function scrollToBottom() {
    //Selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child');
    
    //Heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if( clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
        
    }
}
socket.on('connect', function () {
    const params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {

            // eslint-disable-next-line no-console
            console.log('No error');
            
        } 
    });
});
socket.on('disconnect', function () {
    // eslint-disable-next-line no-console
    console.log('Disconnected from server');
});
socket.on('newMessage', function (message) {
    message.createAt = moment(message.createAt).format('HH:mm');
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template,message);

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message){
    message.createAt = moment(message.createAt).format('HH:mm');
    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template,message);

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function(event){
    event.preventDefault();
    const messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text:messageTextBox.val()
    }, function () {
        messageTextBox.val('');
    });
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (postion) {
        locationButton.removeAttr('disabled').text('Send Location');
        const { latitude, longitude } = postion.coords;
        socket.emit('createLocationMessage',{
            latitude,
            longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fecth location');
    });
});