"use strict";

var app = angular.module('app', [
]);

app.controller('indexCtrl', ['$scope', '$http', '$sce', '$window', function($scope, $http, $sce, $window) {

  $scope.generateDeckSheet = function() {
    $scope.process = true;
    $http.get('/api/deck/' + $scope.deckId).success(function(data) {
      var params = {
        mainDeck: '',
        hyperSpatial: '',
        playerName: 'test'
      };
      if (data.HyperSpatial === null) {
        data.HyperSpatial = [];
      }
      for (var i = 0; i < data.HyperSpatial.length; i++) {
        if (i != 0) {
          params.hyperSpatial += ",";
        }
        params.hyperSpatial += data.HyperSpatial[i];
      }
      for (var i = 0; i < data.MainDeck.length; i++) {
        if (i != 0) {
          params.mainDeck += ",";
        }
        params.mainDeck += data.MainDeck[i];
      }
      $http.post('http://localhost:9090/dmSheet', params, {responseType:'arraybuffer'}).success(function(data) {
        var file = new Blob([data], {type: 'application/pdf'}),
            fileURL = URL.createObjectURL(file);
        $window.open($sce.trustAsResourceUrl(fileURL));
      });
    });
  };

}]);

app.config(['$httpProvider', '$locationProvider', function($httpProvider, $locationProvider) {
  $httpProvider.defaults.headers.common = {'X-Requested-With': 'XMLHttpRequest'};
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
  $httpProvider.defaults.transformRequest = function(data) {
    if (data === undefined) {
      return data;
    }
    return $.param(data);
  }
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);