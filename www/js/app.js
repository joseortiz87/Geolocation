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

.controller('BackgroundController', function($scope, $cordovaGeolocation, $ionicLoading, $ionicPlatform, $interval, $http) {

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

  $scope.registroUbicacion = function(lat,long){
          var brigadista = {
          	location : {
          		longitude: long,
          		recorded_at: new Date(),
          		latitude: lat,
          		speed: '0.0',
          		accuracy: '0.0'
          	},
          	id : $scope.idUser
          };

          console.log("brigadistaVO : " + JSON.stringify(brigadista));
          var headers = {};
          headers['Content-Type'] = 'application/json';
            var request = {
                  method: 'POST',
                  url: 'http://voteengineproject-appsjortiz.rhcloud.com/brigadista/ubicacion',
                  headers: headers,
                  data: JSON.stringify(brigadista)
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

  /**
  BACKGROUND LOCATION
  */
  $scope.locationAjaxCallback = function(response){
    $scope.bgGeo.finish();
  };

  $scope.acquiringLocationBackground = function(location){
    console.log('BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
    //var lat  = location.latitude;
    //var long = location.longitude;

    $scope.locationAjaxCallback.call(this);

  };

  $scope.acquiringLocationFail = function(error){
    console.log('BackgroundGeoLocation error');
  };

  /*
  * WATCH LOCATION
  */
  $scope.onWatchLocationSucess = function(position){
    var lat  = position.coords.latitude;
    var long = position.coords.longitude;
    console.log("position " + JSON.stringify(position));
    $scope.setMapMarker(lat,long);
    $scope.registroUbicacion(lat,long);
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
    $scope.bgGeo = window.plugins.backgroundGeoLocation;

    $scope.bgGeo.configure($scope.acquiringLocationBackground, $scope.acquiringLocationFail, {
        url : "http://voteengineproject-appsjortiz.rhcloud.com/brigadista/ubicacion",
        params: {
            id : $scope.idUser
        },
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        activityType: 'AutomotiveNavigation',
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
    });

    // START LOCATION ACQUIRING
    $scope.play = function() {
      // Enable background mode
      cordova.plugins.backgroundMode.enable();
      // Called when background mode has been activated
      cordova.plugins.backgroundMode.onactivate = function() {
        // if track was playing resume it
        console.log("BackGroundMode active");

      };

      cordova.plugins.backgroundMode.ondeactivate = function() {
        //cordova.plugins.backgroundMode.disable();
        console.log("BackGroundMode desabled " + JSON.stringify($scope.backgroundLocations));
        //$scope.bgGeo.stop();
      };

      window.navigator.geolocation.getCurrentPosition(function(posicion){
        console.log("Fist location...");
        //WATCH FOR LOCATION CHANGES
        $scope.watchLocation = window.navigator.geolocation.watchPosition(
          $scope.onWatchLocationSucess,
          $scope.onWatchLocationError,
          { timeout: 30000 });
        $scope.bgGeo.start();
      }, function(){
        console.log("Error first location...");
      });
    };

    // Stop audio function
    $scope.stop = function() {
      // Stop preloaded track
      console.log("Stop");
      if($scope.interval){
        $interval.cancel($scope.interval);
        $scope.interval = null;
      }
      //cordova.plugins.backgroundMode.disable();
    };

  });

});
