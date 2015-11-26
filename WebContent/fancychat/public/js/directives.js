var appDirectives = angular.module("appDirectives", []);

appDirectives.directive("usersList", function(){
  return {
    restrict: "AE",
    templateUrl: "directives/usersList.html",
    scope: {
      users: "="
    }
  }
});
