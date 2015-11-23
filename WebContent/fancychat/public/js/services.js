var appServices = angular.module("appServices", []);

appServices.factory("restService", function($http){
  return {
    get: function(url){
      $http({
        method: 'GET',
        url: url
      }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    },
    get: function(url){
      $http({
        method: 'POST',
        url: url,
        headers: {
         'Content-Type': "application/json"
        },
        data: { test: 'test' }
      }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
    }
  }
});

appServices.factory("socketService", function(){
  return {
    
  }
});
