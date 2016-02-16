'use strict';

/**
 * @ngdoc function
 * @name yoKittyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the yoKittyApp
 */

angular.module('yoKittyApp')
  .controller('MainCtrl', function ($scope, $http, $uibModal) {
    $scope.subject = 'kittens';
    // pagination
    $scope.results = [];
    $scope.resultsPerPage = 15;
    $scope.page = 0;

    var generateSearchUrl = function() {
      return "http://api.giphy.com/v1/gifs/search?q=" + $scope.subject +
             "&api_key=dc6zaTOxFJmzC&offset=" + ($scope.page * $scope.resultsPerPage);
    };

    $scope.search = function() {
      $http.get(generateSearchUrl()).then(function (response) {
         var data = response.data;
         console.log('data:', data);
         $scope.error = null;

         $scope.results = _.chunk(data.data, 5);
         console.log('results:', $scope.results);
         $scope.total = data.pagination.total_count;
      }, function (data, status) {
         $scope.error = status;
      });
    };

    $scope.showLarge = function(result) {
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'zoomAnimation.html',
        controller: 'ZoomCtrl',
        size: 'lg',
        resolve: {
          imageUrl: function () {
            return result.images.original.url;
          },
          pageUrl: function () {
            return result.url;
          }
        }
      });

      modalInstance.result.then(function () {
        console.log('Dismissed.');
      }, function () {
      });
    };

    $scope.search();
})
.controller('ZoomCtrl', function ($scope, $uibModalInstance, imageUrl, pageUrl) {
  $scope.imageUrl = imageUrl;
  $scope.pageUrl = pageUrl;

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
