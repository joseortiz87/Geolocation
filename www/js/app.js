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

.controller('BackgroundController', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $interval, $http, $cordovaDevice) {

  $scope.map =  null;
  $scope.interval = null;
  $scope.mapOptions = {
      center : new google.maps.LatLng(19.3589621, -99.16929499999999),
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  $scope.posOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
  };
  $scope.bgGeo = null;
  $scope.watchLocation = null;
  $scope.backgroundLocations = [];
  $scope.idUser = "JOSE ORTIZ SAINZ";
  $scope.uuid = null;

  $scope.registroUbicacion = function(location){
          console.log("Se registra ubicacion : " + JSON.stringify(location));
          var headers = {};
          headers['Content-Type'] = 'application/json';
            var request = {
                  method: 'POST',
                  url: 'http://voteengineproject-appsjortiz.rhcloud.com/brigadista/ubicacion/' + $scope.uuid,
                  headers: headers,
                  data: JSON.stringify(location)
              };
            return $http(request);
  };

/*
SET MARKER IN CURRENT MAP
*/
  $scope.setMapMarker = function(lat,long){
    var myLatlng = new google.maps.LatLng(lat, long);
    var marker = new google.maps.Marker({
      position: myLatlng,
      map: $scope.map,
      title: 'Posicion'
    });
    $scope.map.setCenter(myLatlng);
  };

  /*
  * WATCH LOCATION
  */
  $scope.onWatchLocationSucess = function(position){
    var lat  = position.coords.latitude;
    var long = position.coords.longitude;
    console.log("position " + JSON.stringify(position));
    $scope.setMapMarker(lat,long);
    var location = {
      location : {
        longitude: long,
        timestamp: new Date().getTime(),
        latitude: lat,
        speed: 0.0,
        accuracy: 0.0,
        altitude : 0.0,
        heading: 0.0
      }
    };
    $scope.registroUbicacion(location);
  };

  $scope.onWatchLocationError = function(error){
    console.log("Sin cambio en la posicion.");
  };

/*
DOM READY
*/
  $ionicPlatform.ready(function() {

    console.log("Loading ready...");
    $scope.map = new google.maps.Map(document.getElementById("map"), $scope.mapOptions);
    window.navigator.geolocation.getCurrentPosition(function(position){
      console.log("First location - " + JSON.stringify(position));
    });

    $scope.uuid = $cordovaDevice.getUUID();
    console.log("UUID - " + $scope.uuid);

    //Get plugin
    $scope.bgLocationServices =  window.plugins.backgroundLocationServices;

    //Congfigure Plugin
    $scope.bgLocationServices.configure({
     //Both
     desiredAccuracy: 1, // Desired Accuracy of the location updates (lower means more accurate but more battery consumption)
     distanceFilter: 1, // (Meters) How far you must move from the last point to trigger a location update
     debug: true, // <-- Enable to show visual indications when you receive a background location update
     interval: 5000, // (Milliseconds) Requested Interval in between location updates.
     //Android Only
     notificationTitle: 'BG Plugin', // customize the title of the notification
     notificationText: 'Tracking', //customize the text of the notification
     fastestInterval: 5000, // <-- (Milliseconds) Fastest interval your app / server can handle updates
     useActivityDetection: true // Uses Activitiy detection to shut off gps when you are still (Greatly enhances Battery Life)
    });

    //Register a callback for location updates, this is where location objects will be sent in the background
    $scope.bgLocationServices.registerForLocationUpdates(function(location) {
         console.log("We got an BG Update" + JSON.stringify(location));
         $scope.setMapMarker(location.latitude,location.longitude);
         $scope.registroUbicacion(location);
    }, function(err) {
         console.log("Error: Didnt get an update", err);
    });

    //Register for Activity Updates (ANDROID ONLY)
    //Uses the Detected Activies API to send back an array of activities and their confidence levels
    //See here for more information: //https://developers.google.com/android/reference/com/google/android/gms/location/DetectedActivity
    $scope.bgLocationServices.registerForActivityUpdates(function(acitivites) {
         console.log("We got an BG Update" + activities);
    }, function(err) {
         console.log("Error: Something went wrong", err);
    });

    // START LOCATION ACQUIRING
    $scope.play = function() {
      // Enable background mode
      console.log("Start");
      //Start the Background Tracker. When you enter the background tracking will start, and stop when you enter the foreground.
      $scope.bgLocationServices.start();

      //WATCH FOR LOCATION CHANGES
      $scope.watchLocation = window.navigator.geolocation.watchPosition(
          $scope.onWatchLocationSucess,
          $scope.onWatchLocationError,
          { timeout: 30000 });
    };

    // Stop audio function
    $scope.stop = function() {
      // Stop preloaded track
      console.log("Stop");
      ///later, to stop
      $scope.bgLocationServices.stop();
      $scope.watchLocation.clearWatch();
    };

  });

});
