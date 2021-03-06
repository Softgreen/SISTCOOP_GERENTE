'use strict';

/* jshint -W098 */
angular.module('utilidad').controller('Utilidad.ReporteDetalladoController', ['$scope', 'ReportesService',
  function ($scope, ReportesService) {

    $scope.utilidadTotal = undefined;
    $scope.utilidadHistorial = [];
    $scope.view = {
      desde: new Date(),
      hasta: new Date()
    };

    $scope.loadDefaultDates = function() {
      var currentDate = new Date();
      $scope.view.desde.setDate(currentDate.getDate() - 30);
      $scope.view.hasta.setDate(currentDate.getDate() - 1);
    };
    $scope.loadDefaultDates();

    $scope.loadUtilidadTotal = function () {
      ReportesService.getUtilidad().then(function (response) {
        $scope.utilidadTotal = response || 0;
      });
    };
    $scope.loadUtilidadTotal();

    $scope.buscarUtilidades = function() {
      var desde = $scope.view.desde;
      var hasta = $scope.view.hasta;

      ReportesService.getUtilidadHistorial({desde: desde.getTime(), hasta: hasta.getTime()}).then(function(response){
        $scope.utilidadHistorial = response;
      });
    };
    $scope.buscarUtilidades();

  }
]);
