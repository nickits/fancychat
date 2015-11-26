var appControllers = angular.module("appControllers", []);

appControllers.controller("mainCtrl", function($scope){
  $scope.message = "Test";
});

appControllers.controller("ChatCtrl",
    function($scope, socketService, $location, $anchorScroll, $routeParams){
  $scope.message = {};
  $scope.messages = [];

  var chatId = $routeParams.chatId ? $routeParams.chatId : "default";

  socketService.init(chatId, "me");

  socketService.on('new message', function(data){
    if(data){
      data.color = "default";
      addMessage(data);
    }
  });

  $scope.sendMessage = function(text){
    $scope.message.text = "";
    socketService.emit('new message', text);
    addMessage({message: text, username: "me", color: "info", offset: "offset"});
  }

  var addMessage = function(msg){
    $scope.messages.push(msg);
    setTimeout(function(){
      $location.hash('chatBottom');
      $anchorScroll();
    }, 100);
  }
});

appControllers.controller("CallCtrl", function($scope){
  $scope.message = "Test";
});

appControllers.controller("UsersCtrl", function($scope){
  $scope.message = "Test";
});

appControllers.controller("UserDetailCtrl", function($scope){
  $scope.message = "Test";
});
