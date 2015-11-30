var app = angular.module("app", [
  "ngRoute",
  "appControllers",
  "appServices",
  "appDirectives"
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/chat:id', {
        templateUrl: 'pages/chat.html',
        controller: 'ChatCtrl'
      }).
      when('/call:id', {
        templateUrl: 'pages/call.html',
        controller: 'CallCtrl'
      }).
      when('/media:id', {
        templateUrl: 'pages/media.html',
        controller: 'MediaCtrl'
      }).
      when('/drawing:id', {
        templateUrl: 'pages/drawing.html',
        controller: 'DrawingCtrl'
      }).
      when('/presentation:id', {
        templateUrl: 'pages/presentation.html',
        controller: 'CallCtrl'
      }).
      when('/screencast:id', {
        templateUrl: 'pages/call.html',
        controller: 'PresentationCtrl'
      }).
      when('/gallery:id', {
        templateUrl: 'pages/gallery.html',
        controller: 'GalleryCtrl'
      }).
      when('/games:id', {
        templateUrl: 'pages/games.html',
        controller: 'GamesCtrl'
      }).
      when('/polls:id', {
        templateUrl: 'pages/polls.html',
        controller: 'PollsCtrl'
      }).
      when('/quizes:id', {
        templateUrl: 'pages/quizes.html',
        controller: 'QuizesCtrl'
      }).
      when('/users', {
        templateUrl: 'pages/users.html',
        controller: 'UsersCtrl'
      }).
      when('/users/:id', {
        templateUrl: 'pages/user-detail.html',
        controller: 'UserDetailCtrl'
      }).
      when('/rooms', {
        templateUrl: 'pages/rooms.html',
        controller: 'RoomsCtrl'
      }).
      when('/settings', {
        templateUrl: 'pages/settings.html',
        controller: 'SettingsCtrl'
      }).
      when('/recent', {
        templateUrl: 'pages/recent.html',
        controller: 'RecentCtrl'
      }).
      otherwise({
        redirectTo: '/rooms'
      });
}]);
