"use strict";

var app = angular.module('app', [
]);

app.controller('indexCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.generateDeckSheet = function() {
    $scope.process = true;
    $http.get('/api/deck/1075015').success(function(data) {
      var params = {
        mainDeck: '',
        hyperSpatial: '',
        playerName: 'test'
      };
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
      $http({
        method: 'POST',
        url: 'http://localhost:9090/dmSheet',
        data: $.param(params)
      }).success(function(data, status, headers, config) {
        // var file = new Blob([data], {type: 'application/pdf'});
        // var fileURL = URL.createObjectURL(file);
        // //window.open(fileURL);
        // var base64EncodedPDF = System.Convert.ToBase64String(data);
        // window.open("data:application/pdf," + base64EncodedPDF);
        // $scope.process = false;
      });
    });
  };

}]);

app.config(['$httpProvider', '$locationProvider', function($httpProvider, $locationProvider) {
  $httpProvider.defaults.headers.common = {'X-Requested-With': 'XMLHttpRequest'};
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);