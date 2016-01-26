module.exports = function(socket, params){

  socket.on('startline', function (data) {
    socket.broadcast.to(params.room).emit('startline', data);
  });

  socket.on('drawline', function (data) {
    socket.broadcast.to(params.room).emit('drawline', data);
  });

	return {
		init: function(){

		}
	};
};
