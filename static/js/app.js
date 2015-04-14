"use strict";

var app = angular.module('app', [
]);

app.controller('indexCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.generateDeckSheet = function() {

    var hyperSpatial = [], mainDeck = [];

    for (var i = 0; i < 40; i++) {
      mainDeck.push('熱血龍 ドロドロ・ゲキカレーカラ・カレパン');
    }
    hyperSpatial.push('奮戦の精霊龍 デコデッコ・デコリアーヌ・ピッカピカⅢ世');
    hyperSpatial.push('アクア・カスケード〈ZABUUUN・クルーザー〉');


    var data = {
      playerName: 'test',
      mainDeck: mainDeck,
      hyperSpatial: hyperSpatial
    };

    $http({
      method: 'POST',
      url: 'http://localhost:9090/dmSheet',
      data: toQueryString(data)
    }).success(function(data, status, headers, config) {
      console.info(data);
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