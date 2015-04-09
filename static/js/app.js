"use strict";

var app = angular.module('app', [
]);

app.controller('indexCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.generateDeckSheet = function() {
    $http({
      method: 'GET',
      url: '/api/pdf',
    }).success(function(data, status, headers, config) {
      console.info(data);
    }).error(function(data, status, headers, config) {
      console.log(data);
    });
  };

}]);

app.config(['$httpProvider', '$locationProvider', function($httpProvider, $locationProvider) {
  $httpProvider.defaults.headers.common = {'X-Requested-With': 'XMLHttpRequest'};
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
}]);