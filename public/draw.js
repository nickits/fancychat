var Draw = function(socket, canvasId, canvasContainerId){
	
	var c = document.getElementById(canvasId);
	var ctx = c.getContext("2d");
	
	ctx.canvas.width = $("#canvasContainer").width();
	ctx.canvas.height = $("#canvasContainer").height();
	$( window ).on('resize', function() {
		ctx.canvas.width = $("#canvasContainer").width();
		ctx.canvas.height = $("#canvasContainer").height();
	});

	var mouseDown = false;
	$("#myCanvas").on( "mousedown", function(e){
		mouseDown = true;
		var data = {x: e.offsetX, y: e.offsetY};
		startline(data);
		socket.emit('startline', data);
		//console.log('mousedown', e.offsetX, e.offsetY);
	} );

	$("#myCanvas").on( "mouseup", function(e){
		mouseDown = false;
		//console.log('mouseup', e.offsetX, e.offsetY);
	} );

	$("#myCanvas").on( "mousemove", function(e){
		if(mouseDown){
			var data = {x: e.offsetX, y: e.offsetY};
			drawline(data);
			socket.emit('drawline', data);
			//console.log('mousemove', e.offsetX, e.offsetY);
		}
	} );

	var startline = function(data){
		//ctx.clearRect(0,0,200,200);
		ctx.beginPath();
		ctx.moveTo(data.x, data.y);
	};

	var drawline = function(data){
		ctx.lineTo(data.x, data.y);
		ctx.stroke();		
	};

	  socket.on('startline', function (data) {
		 startline(data);
	  });

	  socket.on('drawline', function (data) {
	    drawline(data);
	  });

	return {
		ctx: ctx
	};
};
