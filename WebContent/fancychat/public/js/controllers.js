(function(appControllers){
  appControllers.controller("MainCtrl", function($scope, $routeParams){
    $scope.room = {};
  });

  appControllers.controller("ChatCtrl",
      function($scope, socketService, $location, $anchorScroll, $routeParams, roomService){
    $scope.message = {};
    $scope.messages = [];

    var chatId = $routeParams.id;

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

  appControllers.controller("CallCtrl", function($scope, $routeParams, socketService, webrtcService){
    var chatId = $routeParams.id;
    socketService.init(chatId, "me");
  });

  appControllers.controller("DrawingCtrl", function($scope, drawService, $routeParams){
    var id = $routeParams.id;
    drawService.init("myCanvas", "canvasContainer");
  });

  appControllers.controller("UsersCtrl", function($scope){
    $scope.message = "Test";
  });

  appControllers.controller("UserDetailCtrl", function($scope){
    $scope.message = "Test";
  });

  appControllers.controller("RoomsCtrl", function($scope, roomService){
    $scope.rooms = rooms;

    $scope.select = function(room){
      var oldRoom = roomService.get();
      if(oldRoom){ oldRoom.selected = ""; }
      roomService.set(room);
      room.selected = "warning";
      $scope.$parent.room = room;
    }
  });

  var rooms = [
    {
      id: "111",
      name: "Room 1",
      users: [
        {name: "Name 11", id: "111", msgCount: 1},
        {name: "Name 12", id: "112", msgCount: 2},
        {name: "Name 13", id: "113", msgCount: 3},
        {name: "Name 14", id: "114", msgCount: 4},
        {name: "Name 15", id: "115", msgCount: 11},
        {name: "Name 16", id: "116", msgCount: 12},
        {name: "Name 17", id: "117", msgCount: 13},
        {name: "Name 18", id: "118", msgCount: 133},
        {name: "Name 19", id: "119", msgCount: 134}
      ]
    },
    {
      id: "222",
      name: "Room 2",
      users: [
        {name: "Name 21", id: "221", msgCount: 1},
        {name: "Name 22", id: "222", msgCount: 2},
        {name: "Name 23", id: "223", msgCount: 3},
        {name: "Name 24", id: "224", msgCount: 4},
        {name: "Name 25", id: "225", msgCount: 11},
        {name: "Name 26", id: "226", msgCount: 12},
        {name: "Name 27", id: "227", msgCount: 13},
        {name: "Name 28", id: "228", msgCount: 133},
        {name: "Name 29", id: "229", msgCount: 134}
      ]
    },
    {
      id: "333",
      name: "Room 3",
      users: [
        {name: "Name 31", id: "331", msgCount: 1},
        {name: "Name 32", id: "332", msgCount: 2},
        {name: "Name 33", id: "333", msgCount: 3},
        {name: "Name 34", id: "334", msgCount: 4},
        {name: "Name 35", id: "335", msgCount: 11},
        {name: "Name 36", id: "336", msgCount: 12},
        {name: "Name 37", id: "337", msgCount: 13},
        {name: "Name 38", id: "338", msgCount: 133},
        {name: "Name 39", id: "339", msgCount: 134}
      ]
    },
    {
      id: "444",
      name: "Room 4",
      users: [
        {name: "Name 41", id: "441", msgCount: 1},
        {name: "Name 42", id: "442", msgCount: 2},
        {name: "Name 43", id: "443", msgCount: 3},
        {name: "Name 44", id: "444", msgCount: 4},
        {name: "Name 45", id: "445", msgCount: 11},
        {name: "Name 46", id: "446", msgCount: 12},
        {name: "Name 47", id: "447", msgCount: 13},
        {name: "Name 48", id: "448", msgCount: 133},
        {name: "Name 49", id: "449", msgCount: 134}
      ]
    }
  ];
}(angular.module("appControllers", [])));
