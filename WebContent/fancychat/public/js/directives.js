(function(appDirectives){
  appDirectives.directive("usersList", function(){
    return {
      restrict: "AE",
      templateUrl: "directives/usersList.html",
      scope: {
        users: "="
      },
      controller: function($scope, $rootScope){
        $scope.select = function(user){
          $rootScope.room = { id: user.id };
        }
      }
    }
  });
}(angular.module("appDirectives", [])));
