// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova','ngMessages','starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$httpProvider) {

// Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
// If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
$urlRouterProvider.otherwise('/');

  /* CORS... */
  $httpProvider.defaults.useXDomain = true;
  $httpProvider.defaults.withCredentials = true;
  //delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://voteengineproject-appsjortiz.rhcloud.com';
  $httpProvider.defaults.timeout = 500;

  // Add CSRF Token support
  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

  $httpProvider.defaults.headers.put['Content-Type'] = 'application/json';

  //DONT REMOVE SLASH URL
  //$resourceProvider.defaults.stripTrailingSlashes = false;

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('app', {
    url: "/app",
    templateUrl: "views/geolocation.html",
    controller: 'BackgroundController'
  })

  .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
