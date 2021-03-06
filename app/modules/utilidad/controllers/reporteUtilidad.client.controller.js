'use strict';

/* jshint -W098 */
angular.module('utilidad').controller('Utilidad.ReporteUtilidadController', ['$scope', '$timeout', 'ReportesService', 'ReporteCajaBancosService',
  function ($scope, $timeout, ReportesService, ReporteCajaBancosService) {

    $scope.utilidad = {
      total: undefined,

      netaDelDia: undefined,
      utilidadHistorial: undefined,

      soles: undefined,
      dolares: undefined,
      euros: undefined
    };

    $scope.moneda = {
      soles: {id: 1, denominacion: 'Nuevos Soles'},
      dolares: {id: 0, denominacion: 'Dolares'},
      euros: {id: 2, denominacion: 'Euros'}
    };

    $scope.caja = {
      soles: undefined,
      dolares: undefined,
      euros: undefined
    };
    $scope.bancos = {
      soles: undefined,
      dolares: undefined,
      euros: undefined
    };

    $scope.cuentasPorCobrar = {
      soles: undefined,
      dolares: undefined,
      euros: undefined
    };
    $scope.cuentasPorPagar = {
      soles: undefined,
      dolares: undefined,
      euros: undefined
    };

    $scope.patrimonio = {
      soles: undefined,
      dolares: undefined,
      euros: undefined
    };

    $scope.loadUtilidad = function () {
      ReportesService.getUtilidad().then(function (response) {
        $scope.utilidad.total = response || 0;
      });
      ReportesService.getUtilidad({idMoneda: 1}).then(function (response) {
        $scope.utilidad.soles = response || 0;
      });
      ReportesService.getUtilidad({idMoneda: 0}).then(function (response) {
        $scope.utilidad.dolares = response || 0;
      });
      ReportesService.getUtilidad({idMoneda: 2}).then(function (response) {
        $scope.utilidad.euros = response || 0;
      });
    };
    $scope.loadUtilidad();

    $scope.loadCaja = function() {
      ReporteCajaBancosService.getTotalCaja({idmoneda: 1}).then(function (response) {
        $scope.caja.soles = response || 0;
      });
      ReporteCajaBancosService.getTotalCaja({idmoneda: 0}).then(function (response) {
        $scope.caja.dolares = response || 0;
      });
      ReporteCajaBancosService.getTotalCaja({idmoneda: 2}).then(function (response) {
        $scope.caja.euros = response || 0;
      });
    };
    $scope.loadCaja();

    $scope.loadBancos = function() {
      ReporteCajaBancosService.getTotalBancos({idMoneda: 1}).then(function (response) {
        $scope.bancos.soles = response || 0;
      });
      ReporteCajaBancosService.getTotalBancos({idMoneda: 0}).then(function (response) {
        $scope.bancos.dolares = response || 0;
      });
      ReporteCajaBancosService.getTotalBancos({idMoneda: 2}).then(function (response) {
        $scope.bancos.euros = response || 0;
      });
    };
    $scope.loadBancos();

    $scope.loadCuentasPorPagar = function() {
      ReportesService.getCuentasPorPagar({idMoneda: 1}).then(function (response) {
        $scope.cuentasPorPagar.soles = response || 0;
      });
      ReportesService.getCuentasPorPagar({idMoneda: 0}).then(function (response) {
        $scope.cuentasPorPagar.dolares = response || 0;
      });
      ReportesService.getCuentasPorPagar({idMoneda: 2}).then(function (response) {
        $scope.cuentasPorPagar.euros = response || 0;
      });
    };
    $scope.loadCuentasPorPagar();

    $scope.loadCuentasPorCobrar = function() {
      ReportesService.getCuentasPorCobrar({idMoneda: 1}).then(function (response) {
        $scope.cuentasPorCobrar.soles = response || 0;
      });
      ReportesService.getCuentasPorCobrar({idMoneda: 0}).then(function (response) {
        $scope.cuentasPorCobrar.dolares = response || 0;
      });
      ReportesService.getCuentasPorCobrar({idMoneda: 2}).then(function (response) {
        $scope.cuentasPorCobrar.euros = response || 0;
      });
    };
    $scope.loadCuentasPorCobrar();

    $scope.loadPatrimonio = function() {
      ReportesService.getPatrimonio({idMoneda: 1}).then(function (response) {
        $scope.patrimonio.soles = response || 0;
      });
      ReportesService.getPatrimonio({idMoneda: 0}).then(function (response) {
        $scope.patrimonio.dolares = response || 0;
      });
      ReportesService.getPatrimonio({idMoneda: 2}).then(function (response) {
        $scope.patrimonio.euros = response || 0;
      });
    };
    $scope.loadPatrimonio();

    // Utilidad Historial
    $scope.chartConfig = {
      data: {
        x: 'x',
        columns: [
          ['x'],
          ['Utilidad']
        ]
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%d-%m-%Y'
          }
        }
      },
      grid: {
        x: {
          show: true
        },
        y: {
          show: true
        }
      }
    };

    $scope.addDataPoint = function (fecha, utilidad) {
      $scope.chartConfig.data.columns[0].push(fecha);
      $scope.chartConfig.data.columns[1].push(utilidad);
    };

    var loadHistorialUtilidades = function() {
      var desde = new Date();
      var hasta = new Date();

      var currentDate = new Date();
      desde.setDate(currentDate.getDate() - 30);
      hasta.setDate(currentDate.getDate() - 1);

      ReportesService.getUtilidadHistorial({desde: desde.getTime(), hasta: hasta.getTime()}).then(function(response){
        $scope.utilidad.utilidadHistorial = response;
      });
    };
    loadHistorialUtilidades();


    //Load Utilidad neta del dia
    $scope.$watch('utilidad.total', function(newValue, oldValue) {
      reloadUtilidadDelDia();
    }, true);

    $scope.$watchCollection('utilidad.utilidadHistorial', function(newValue, oldValue) {
      reloadUtilidadDelDia();
    }, true);

    var reloadUtilidadDelDia = function(){
      var utilidadTotal = 0;
      if($scope.utilidad.total) {
        utilidadTotal = $scope.utilidad.total;
      }

      var ultimaUtilidadTotal = 0;
      if($scope.utilidad.utilidadHistorial) {
        var ultimaUtilidadObj = $scope.utilidad.utilidadHistorial[$scope.utilidad.utilidadHistorial.length - 1];
        if(ultimaUtilidadObj) {
          ultimaUtilidadTotal = ultimaUtilidadObj.utilidadTotal;
        }
      }
      $scope.utilidad.netaDelDia = utilidadTotal - ultimaUtilidadTotal;
    };





    /*Por periodos**/
    var refreshDates = function(){
      $scope.view = {
        desde: new Date(),
        hasta: new Date()
      };
    };
    refreshDates();

    $scope.$watch('combo.selected.periodo', function(newVal, oldVal){
      if(angular.isDefined(newVal)) {
        if(newVal === 'DIARIO') {
          refreshDates();
          var currentDate = new Date();
          $scope.view.desde.setDate(currentDate.getDate() - 30);
          $scope.view.hasta.setDate(currentDate.getDate());
        } else if(newVal === 'MENSUAL') {
          refreshDates();
          var currentDate = new Date();
          $scope.view.desde.setDate(currentDate.getDate() - (30 * 12));
          $scope.view.hasta.setDate(currentDate.getDate());
        } else if(newVal === 'ANUAL') {
          refreshDates();
          var currentDate = new Date();
          $scope.view.desde.setDate(currentDate.getDate() - (360 * 12));
          $scope.view.hasta.setDate(currentDate.getDate());
        }
      }
    }, true);

    $scope.combo = {
      periodo: ['DIARIO', 'MENSUAL', 'ANUAL']
    };
    $scope.combo.selected = {
      periodo: 'DIARIO'
    };
    $scope.loadHistorialPorPeriodos = function () {
      console.log($scope.view.desde);
      console.log($scope.view.hasta);
      ReportesService.getUtilidadHistorialPeriodo({desde: $scope.view.desde.getTime(), hasta: $scope.view.hasta.getTime(), periodo: $scope.combo.selected.periodo}).then(function(response){
        $scope.chartConfig.data.columns[0] = ['x'];
        $scope.chartConfig.data.columns[1] = ['Utilidad'];

        for(var i = 0; i < response.length; i++) {
          var date = new Date();
          date.setYear(response[i].anio);
          date.setMonth(angular.isDefined(response[i].mes) ? response[i].mes: 1);
          date.setDate(angular.isDefined(response[i].dia) ? response[i].dia : 1);

          $scope.addDataPoint(date, response[i].utilidad);
        }
      });
    };

    $timeout($scope.loadHistorialPorPeriodos, 500);

  }
]);
