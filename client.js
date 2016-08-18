var app = angular.module('brainlab', ['ui.router', 'ui.bootstrap']);

app.config(function($urlRouterProvider) {
  $urlRouterProvider.when('', '/upload');
  $urlRouterProvider.when('/', '/upload');

})


