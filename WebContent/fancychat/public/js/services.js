(function(appServices){
  appServices.factory("restService", function($http){
    return {
      get: function(url, successFn, errorFn){
        $http({
          method: 'GET',
          url: url
        }).then(function successCallback(response) {
            if(successFn) { successFn(response); }
          }, function errorCallback(response) {
            if(errorFn) { errorFn(response); }
          });
      },
      post: function(url, data){
        $http({
          method: 'POST',
          url: url,
          headers: {
           'Content-Type': "application/json"
          },
          data: data
        }).then(function successCallback(response) {
            if(successFn) { successFn(response); }
          }, function errorCallback(response) {
            if(errorFn) { errorFn(response); }
          });
      }
    }
  });

  appServices.factory("socketService", function($rootScope){
    var socket = io.connect();
    return {
      init: function(roomId, username){
        // Tell the server your username
        socket.emit('add user', username);
        //join the room
        socket.emit('room', roomId);
      },
      emit: function(eventName, data, callback){
        // tell server to execute 'new message' and send along one parameter
        socket.emit(eventName, data, function(){
          var args = arguments;
          $rootScope.$apply(function(){
            if(callback){ callback.apply(socket, args); }
          });
        });
      },
      on: function(eventName, callback){
        // Whenever the server emits 'new message', update the chat body
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function(){
            if(callback){ callback.apply(socket, args); }
          });
        });
      }
    }
  });

  appServices.factory("drawService", function(socketService){
    var drawer = { current: "line" };
    $( window ).on('resize', function() {
      var width = drawer.ctx.canvas.width;
      var height = drawer.ctx.canvas.height;
      var imgData=drawer.ctx.getImageData(0, 0, width, height);
      drawer.ctx.canvas.width = drawer.canvasContainer.width();
      drawer.ctx.canvas.height = $(window).height() - 120;
      drawer.ctx.putImageData(imgData, 0, 0);
    });

    return {
      init: function(canvasId, canvasContainerId){

      	drawer.c = document.getElementById(canvasId);
      	drawer.ctx = drawer.c.getContext("2d");
        drawer.canvasContainer = $("#" + canvasContainerId);
        drawer.canvas = $("#" + canvasId);

      	drawer.ctx.canvas.width = drawer.canvasContainer.width();
      	drawer.ctx.canvas.height = $(window).height() - 120;

      	var mouseDown = false;
      	drawer.canvas.on( "mousedown", function(e){
      		mouseDown = true;
      		var data = {x: e.offsetX, y: e.offsetY};
      		startline(data);
      		socketService.emit('startline', data);
      		//console.log('mousedown', e.offsetX, e.offsetY);
      	} );

      	drawer.canvas.on( "mouseup", function(e){
      		mouseDown = false;
      		//console.log('mouseup', e.offsetX, e.offsetY);
      	} );

      	drawer.canvas.on( "mousemove", function(e){
      		if(mouseDown){
      			var data = {x: e.offsetX, y: e.offsetY};
      			drawline(data);
      			socketService.emit('drawline', data);
      			//console.log('mousemove', e.offsetX, e.offsetY);
      		}
      	} );

      	var startline = function(data){
      		//drawer.ctx.clearRect(0,0,200,200);
      		drawer.ctx.beginPath();
      		drawer.ctx.moveTo(data.x, data.y);
      	};

      	var drawline = function(data){
      		drawer.ctx.lineTo(data.x, data.y);
      		drawer.ctx.stroke();
      	};

      	socketService.on('startline', function (data) {
      	   startline(data);
      	});

      	socketService.on('drawline', function (data) {
      	   drawline(data);
      	});
      },
      toolSet: function(data){
        drawer.current = data.drawingTool;
      }
    }
  });

  appServices.factory("roomService", function(){
    var room = {};
    return {
      get: function(){
        return room;
      },
      set: function(r){
        room = r;
      }
    }
  });

  appServices.factory("webrtcService", function(socketService){

    return {
      startLocalStream: function(){

      },
      stopLocalStream: function(){

      },
      startRemoteStream: function(){

      },
      stopRemoteStream: function(){

      }
    }
  });

}(angular.module("appServices", [])));
