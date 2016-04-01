// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','ngCordova'])

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

.controller('BackgroundController', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $interval) {

  $scope.map =  null;
  $scope.interval = null;
  $scope.mapOptions = {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
  };

/*
DOM READY
*/
  $ionicPlatform.ready(function() {

    $scope.map = new google.maps.Map(document.getElementById("map_canvas"), $scope.mapOptions);

    $scope.acquiringLocation = function(){
        $ionicLoading.show({
            template: '<ion-spinner icon="bubbles"></ion-spinner><br/>Acquiring location!'
        });

        $cordovaGeolocation.getCurrentPosition($scope.posOptions).then(function (position) {
            var lat  = position.coords.latitude;
            var long = position.coords.longitude;

            var myLatlng = new google.maps.LatLng(lat, long);

            var marker = new google.maps.Marker({
              position: myLatlng,
              map: $scope.map,
              title: 'Posicion'
            });
            $scope.map.setCenter(myLatlng);

            $ionicLoading.hide();

        }, function(err) {
            $ionicLoading.hide();
            console.log(err);
        });
    };

    // Play audio function
    $scope.play = function() {
      // Enable background mode while track is playing
      cordova.plugins.backgroundMode.enable();
      // Called when background mode has been activated
      cordova.plugins.backgroundMode.onactivate = function() {
        // if track was playing resume it
        $scope.interval = $interval(function() {
            acquiringLocation();
          }, 500);
      };

      cordova.plugins.backgroundMode.ondeactivate = function() {
        //cordova.plugins.backgroundMode.disable();
      };

      // Start preloaded track
      acquiringLocation();
    };

    // Stop audio function
    $scope.stop = function() {
      // Stop preloaded track
      if($scope.interval){
        $interval.cancel($scope.interval);
        $scope.interval = null;
      }
      //cordova.plugins.backgroundMode.disable();
    };


  });

});
