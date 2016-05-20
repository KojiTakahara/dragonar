"use strict";

var app = angular.module('app', [
]);

app.controller('indexCtrl', ['$scope', '$http', '$sce', '$window', function($scope, $http, $sce, $window) {

  $scope.inputType = "id";
  $scope.deckSheetType = "official";

  $scope.generateDeckSheet = function() {
    $scope.process = true;
    if ($scope.inputType === "id") {
      if ($scope.deckId === "" || $scope.deckId == null || !angular.isNumber($scope.deckId - 0)) {
        $scope.process = false;
        return;
      }
      scraping();
    } else {
      if ($scope.deckText === "" || $scope.deckText == null) {
        $scope.process = false;
        return;
      }
      formatText();
    }
  };

  var scraping = function() {
    $http.get('/api/deck/' + $scope.deckId).success(function(data) {
      var params = {
        mainDeck: '',
        hyperSpatial: '',
        playerName: $scope.name,
        format: $scope.deckSheetType,
        deckId: $scope.deckId
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
      callApi(params);
    }).error(function(data, status, headers, config) {
      $scope.process = false;
    });
  };

  var formatText = function() {
    var params = {
      mainDeck: '',
      hyperSpatial: '',
      playerName: $scope.name,
      format: $scope.deckSheetType,
      deckId: 1
    };
    var textList = $scope.deckText.split(/\r\n|\r|\n/);
    var mainDeckSize = 40;
    var hyperSpatialSize = 8;
    for (var i = 0; i < textList.length; i++) {
      if (1 == i) {
        params.deckId = textList[i].split(/(.*)dmvault.ath.cx\/deck(.*).html(.*)/)[2];
      }
      if (2 <= i) {
        var count = textList[i].split(" x ")[0];
        var name = textList[i].split(" x ")[1];
        for (var j = 0; j < count; j++) {
          if (0 < mainDeckSize) {
            if (mainDeckSize != 40) {
              params.mainDeck += ",";
            }
            params.mainDeck += name;
            mainDeckSize--;
          } else if (0 < hyperSpatialSize) {
            if (hyperSpatialSize != 8) {
              params.hyperSpatial += ",";
            }
            params.hyperSpatial += name.split("／")[0];
            hyperSpatialSize--;
          }
        }
      }
    }
    if (params.mainDeck != "") {
      callApi(params);
    } else {
      $scope.process = false;
    }
  };

  var callApi = function(params) {
    // $http.post('http://localhost:9000/dmSheet', params, {responseType:'arraybuffer'}).success(function(data) {
      $http.post('https://decksheet-api.herokuapp.com/dmSheet', params, {responseType:'arraybuffer'}).success(function(data) {
      var file = new Blob([data], {type: 'application/pdf'}),
          fileURL = URL.createObjectURL(file);
      if (new UAParser().getOS().name === "iOS") {
        var reader = new FileReader();
        reader.onload = function(e){
          var bdata = btoa(reader.result);
          var datauri = 'data:application/pdf;base64,' + bdata;
          $window.location.href = datauri;
        }
        reader.readAsBinaryString(file);
      } else {
        $window.open($sce.trustAsResourceUrl(fileURL));
      }
      $scope.process = false;
    }).error(function(data, status, headers, config) {
      $scope.process = false;
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