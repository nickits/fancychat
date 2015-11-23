var app = angular.module("app", [
  "ngRoute",
  "appControllers",
  "appServices"
]);

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/chat', {
        templateUrl: 'pages/chat.html',
        controller: 'ChatCtrl'
      }).
      when('/call', {
        templateUrl: 'pages/call.html',
        controller: 'CallCtrl'
      }).
      when('/media', {
        templateUrl: 'pages/media.html',
        controller: 'MediaCtrl'
      }).
      when('/drawing', {
        templateUrl: 'pages/drawing.html',
        controller: 'DrawingCtrl'
      }).
      when('/presentation', {
        templateUrl: 'pages/presentation.html',
        controller: 'CallCtrl'
      }).
      when('/screencast', {
        templateUrl: 'pages/call.html',
        controller: 'PresentationCtrl'
      }).
      when('/gallery', {
        templateUrl: 'pages/gallery.html',
        controller: 'GalleryCtrl'
      }).
      when('/games', {
        templateUrl: 'pages/games.html',
        controller: 'GamesCtrl'
      }).
      when('/polls', {
        templateUrl: 'pages/polls.html',
        controller: 'PollsCtrl'
      }).
      when('/quizes', {
        templateUrl: 'pages/quizes.html',
        controller: 'QuizesCtrl'
      }).
      when('/users', {
        templateUrl: 'pages/users.html',
        controller: 'UsersCtrl'
      }).
      when('/users/:userId', {
        templateUrl: 'pages/user-detail.html',
        controller: 'UserDetailCtrl'
      }).
      when('/groups', {
        templateUrl: 'pages/groups.html',
        controller: 'GroupsCtrl'
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
        redirectTo: '/chat'
      });
}]);
