module.exports = function(socket, params){

	// when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(params.room).emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.to(params.room).emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.to(params.room).emit('stop typing', {
      username: socket.username
    });
  });

	return {
		init: function(){

		}
	};
};
