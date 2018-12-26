const socket = io();
socket.on('updateRooms', function (rooms) {
    console.log('Rooms updated', rooms);
    
    const select = jQuery('<select name="listrooms"></select>');
    rooms.forEach(room => {
        select.append(jQuery('<option></option>').text(room).val(room));
    });
    jQuery('#rooms').html(select);
});

socket.emit('getUpdateRooms');