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

appServices.factory("socketService", function($rootScope){
  var socket = io.connect();
  return {
    init: function(room, username){
      //join the room
      socket.emit('room', room);
      // Tell the server your username
      socket.emit('add user', username);
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
