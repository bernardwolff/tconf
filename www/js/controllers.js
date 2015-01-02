// works similarly to $.get
// adapted from http://youmightnotneedjquery.com/
function get(url, success_callback, error_callback){

  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      success_callback(request);
    } else {
      // We reached our target server, but it returned an error
      error_callback(request);
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    error_callback(request);
  };

  request.send();
}

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
/*  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];*/
  $scope.playlists = [{title: 'Loading...', id: 1}];

  function success_callback(request) {
    var all_users = JSON.parse(request.responseText);
    console.log("ajax call succeeded ", JSON.stringify(all_users));
    $scope.playlists = all_users.map(function(user) { return {title: user.name, id: user.username}; }); 
  }

  function error_callback(request) {
    // run the following command to see the js console:
    // adb logcat | grep -i console
    if (reqest && request.status !== undefined && request.status != "")
      console.log("ajax call failed with status code ", request.status); 
    else
      console.log("ajax call failed"); 
  }

  get('all_users.json', success_callback, error_callback);
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
