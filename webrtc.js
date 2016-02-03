module.exports = function(socket, params){

  socket.on('createOffer', function (message) {
    log('Got message:', message);
    // for a real app, would be room only (not broadcast)
    socket.broadcast.emit('createOffer', message);
  });

  socket.on('createAnswer', function (message) {
    log('Got message:', message);
    // for a real app, would be room only (not broadcast)
    socket.broadcast.emit('createAnswer', message);
  });

	return {
		init: function(){

		}
	};
};
