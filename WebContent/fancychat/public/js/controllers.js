var appControllers = angular.module("appControllers", []);

appControllers.controller("mainCtrl", function($scope){
  $scope.message = "Test";
});

appControllers.controller("ChatCtrl", function($scope, socketService){
  $scope.message = {};
  $scope.messages = [];

  socketService.init("1", "me");

  socketService.onReceive(function(data){
    if(data){
      $scope.messages.push(data);
    }
  });

  $scope.sendMessage = function(text){
    socketService.send(text);
    $scope.message.text = "";
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
