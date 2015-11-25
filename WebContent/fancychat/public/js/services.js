var appServices = angular.module("appServices", []);

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

appServices.factory("socketService", function(){
  var socket = io();
  return {
    init: function(room, username){
      socket
      //join the room
      socket.emit('room', room);
      // Tell the server your username
      socket.emit('add user', username);
    },
    send: function(message, room){
      // tell server to execute 'new message' and send along one parameter
      socket.emit('new message', message);
    },
    onReceive: function(receiveFn){
      // Whenever the server emits 'new message', update the chat body
      socket.on('new message', function (data) {
        if(receiveFn){ receiveFn(data); }
      });
    }
  }
});
