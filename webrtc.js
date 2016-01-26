module.exports = function(socket, params){

  socket.on('message', function (message) {
    log('Got message:', message);
    // for a real app, would be room only (not broadcast)
    socket.broadcast.emit('message', message);
  });

	return {
		init: function(){

		}
	};
};
