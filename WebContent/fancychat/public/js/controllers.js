var appControllers = angular.module("appControllers", []);

appControllers.controller("mainCtrl", function($scope){
  $scope.users = users;
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
    scrollBottom();
  }

  var scrollBottom = function(){
    setTimeout(function(){
      $location.hash('chatfix');
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

var users = [
  {name: "Name 1", id: "111", msgCount: 1},
  {name: "Name 2", id: "112", msgCount: 2},
  {name: "Name 3", id: "113", msgCount: 3},
  {name: "Name 4", id: "114", msgCount: 4},
  {name: "Name 5", id: "115", msgCount: 11},
  {name: "Name 6", id: "116", msgCount: 12},
  {name: "Name 7", id: "117", msgCount: 13},
  {name: "Name 8", id: "118", msgCount: 133},
  {name: "Name 9", id: "119", msgCount: 134}
];
